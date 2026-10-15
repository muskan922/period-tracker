import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

// GET all community posts with comments
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = posts.map(p => ({
      id: p.id,
      author: p.author,
      avatar: p.avatar,
      title: p.title,
      content: p.content,
      tags: p.tags,
      likes: p.likes,
      liked: p.liked,
      saved: p.saved,
      time: p.timeAgo,
      comments: p.comments.map(c => ({
        id: c.id,
        author: c.author,
        avatar: c.avatar,
        content: c.content,
        time: c.timeAgo
      }))
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Database error fetching posts' });
  }
});

// CREATE community post
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { title, content, tags } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const authorName = user ? user.name : 'Emma_R';

    const created = await prisma.communityPost.create({
      data: {
        userId,
        author: authorName,
        avatar: user?.avatar || '🌸',
        title,
        content,
        tags: tags || [],
        likes: 0,
        liked: false,
        saved: false,
        timeAgo: 'Just now'
      }
    });

    res.status(201).json({
      id: created.id,
      author: created.author,
      avatar: created.avatar,
      title: created.title,
      content: created.content,
      tags: created.tags,
      likes: created.likes,
      liked: created.liked,
      saved: created.saved,
      time: created.timeAgo,
      comments: []
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// LIKE post
router.post('/:id/like', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id }
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const newLiked = !post.liked;
    const newLikes = newLiked ? post.likes + 1 : Math.max(0, post.likes - 1);

    const updated = await prisma.communityPost.update({
      where: { id },
      data: {
        liked: newLiked,
        likes: newLikes
      }
    });

    res.json({ id: updated.id, likes: updated.likes, liked: updated.liked });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to toggle post like' });
  }
});

// SAVE post
router.post('/:id/save', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id }
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updated = await prisma.communityPost.update({
      where: { id },
      data: {
        saved: !post.saved
      }
    });

    res.json({ id: updated.id, saved: updated.saved });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to toggle post save' });
  }
});

// ADD COMMENT
router.post('/:id/comments', requireAuth, async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  const { content } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const authorName = user ? user.name : 'Emma Rose';

    const comment = await prisma.postComment.create({
      data: {
        postId: id,
        author: authorName,
        avatar: user?.avatar || '🌸',
        content,
        timeAgo: 'Just now'
      }
    });

    res.status(201).json({
      id: comment.id,
      author: comment.author,
      avatar: comment.avatar,
      content: comment.content,
      time: comment.timeAgo
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;
