import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

// GET all community posts with comments
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const posts = await prisma.communityPost.findMany({
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        },
        postLikes: true,
        postSaves: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = posts.map(p => {
      const isLiked = userId ? p.postLikes.some(l => l.userId === userId) : p.liked;
      const isSaved = userId ? p.postSaves.some(s => s.userId === userId) : p.saved;
      const totalLikes = Math.max(p.likes, p.postLikes.length);
      return {
        id: p.id,
        author: p.author,
        avatar: p.avatar,
        title: p.title,
        content: p.content,
        tags: p.tags,
        likes: totalLikes,
        liked: isLiked,
        saved: isSaved,
        time: p.timeAgo,
        comments: p.comments.map(c => ({
          id: c.id,
          author: c.author,
          avatar: c.avatar,
          content: c.content,
          time: c.timeAgo
        }))
      };
    });

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
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id }
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId: id }
      }
    });

    let liked = false;
    if (existingLike) {
      await prisma.postLike.delete({ where: { id: existingLike.id } });
      liked = false;
    } else {
      await prisma.postLike.create({
        data: { userId, postId: id }
      });
      liked = true;
    }

    const currentLikesCount = await prisma.postLike.count({ where: { postId: id } });
    await prisma.communityPost.update({
      where: { id },
      data: { likes: currentLikesCount }
    });

    res.json({ id, likes: currentLikesCount, liked });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to toggle post like' });
  }
});

// SAVE post
router.post('/:id/save', requireAuth, async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id }
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingSave = await prisma.postSave.findUnique({
      where: {
        userId_postId: { userId, postId: id }
      }
    });

    let saved = false;
    if (existingSave) {
      await prisma.postSave.delete({ where: { id: existingSave.id } });
      saved = false;
    } else {
      await prisma.postSave.create({
        data: { userId, postId: id }
      });
      saved = true;
    }

    res.json({ id, saved });
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
