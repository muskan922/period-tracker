import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Heart, Bookmark, MessageSquare, Plus, Search, Send } from 'lucide-react';

export const Community: React.FC = () => {
  const { posts, likePost, savePost, addComment, createPost } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTag, setSearchTag] = useState('');
  
  // New Post Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Comment input dictionary per post id
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill out title and content.');
      return;
    }
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    createPost(title, content, tags);

    setTitle('');
    setContent('');
    setTagsInput('');
    setShowAddForm(false);
    alert('Post pinned anonymously in the Sister Circle! 🌸');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text) return;
    addComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Filter posts based on search tag
  const filteredPosts = posts.filter(post => 
    !searchTag || post.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
            <Users className="w-7 h-7 text-accent" />
            Sister Circle
          </h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">An anonymous, supportive sanctuary to share stories, wellness recipes, and support.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search tag (e.g. nutrition)..." 
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="bg-cream/45 border border-borderPink/60 pl-8 pr-4 py-2 rounded-full text-xs"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-vintageText/55" />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* New Post Form */}
      {showAddForm && (
        <form onSubmit={handleCreatePost} className="glass-card rounded-premium-lg p-6 space-y-4 max-w-xl mx-auto border border-accent/35 bg-cream/30 animate-fade-in">
          <h3 className="font-heading text-base font-semibold text-darkText">Share an experience anonymously</h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Discussion Title</label>
            <input 
              type="text" 
              placeholder="e.g. My Seed Cycling Journey for PCOS" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Content</label>
            <textarea
              placeholder="Share details of your remedy, hormonal shifts, or personal cycle reflection..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-borderPink/60 p-3 rounded-premium-md text-xs resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Tags (comma separated)</label>
            <input 
              type="text" 
              placeholder="Herbal Remedies, PCOS, Sleep" 
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 rounded-full border border-borderPink/60 text-xs text-vintageText hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-darkText transition-colors shadow-soft-glow"
            >
              Publish Post
            </button>
          </div>
        </form>
      )}

      {/* Pinterest-like Collage Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="break-inside-avoid glass-card rounded-premium-lg p-5 border border-borderPink/45 flex flex-col justify-between space-y-4 bg-white/40 shadow-premium hover:shadow-soft-glow transition-all duration-300">
            
            {/* Post Author header */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary/45 border border-accent/20 flex items-center justify-center text-sm shadow-soft-glow">
                {post.avatar}
              </span>
              <div>
                <h4 className="text-[11px] font-semibold text-darkText">{post.author}</h4>
                <p className="text-[9px] text-vintageText/45 font-subtitle">{post.time}</p>
              </div>
            </div>

            {/* Title & Content */}
            <div className="space-y-1.5">
              <h3 className="font-heading text-base font-semibold text-darkText leading-tight">{post.title}</h3>
              <p className="text-xxs leading-relaxed text-vintageText/80 font-body">{post.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  onClick={() => setSearchTag(tag)}
                  className="px-2 py-0.5 rounded-full bg-cream border border-borderPink/45 text-[8.5px] font-semibold uppercase tracking-wider font-subtitle text-vintageText/65 cursor-pointer hover:bg-accent/10 hover:border-accent"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Reactions Bar */}
            <div className="flex items-center justify-between border-y border-borderPink/25 py-2.5 text-xxs font-subtitle">
              <button 
                onClick={() => likePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-rose-500 font-bold' : 'text-vintageText/65 hover:text-rose-400'}`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{post.likes} Hearts</span>
              </button>
              
              <button 
                onClick={() => savePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${post.saved ? 'text-amber-500 font-bold' : 'text-vintageText/65 hover:text-amber-500'}`}
              >
                <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{post.saved ? 'Saved' : 'Save'}</span>
              </button>

              <span className="flex items-center gap-1.5 text-vintageText/65">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments.length} Replies</span>
              </span>
            </div>

            {/* Comments Sub-List */}
            {post.comments.length > 0 && (
              <div className="space-y-2.5 pt-1.5 border-t border-dashed border-borderPink/30 max-h-36 overflow-y-auto pr-1">
                {post.comments.map(c => (
                  <div key={c.id} className="text-xxs bg-cream/30 p-2 rounded-premium-md border border-borderPink/20 flex gap-2">
                    <span className="text-sm shrink-0 mt-0.5">{c.avatar}</span>
                    <div className="flex-1 min-w-0 leading-relaxed font-body">
                      <div className="flex items-center justify-between gap-1 mb-0.5 font-subtitle">
                        <span className="font-semibold text-darkText truncate">{c.author}</span>
                        <span className="text-[8px] text-vintageText/45 shrink-0">{c.time}</span>
                      </div>
                      <p className="text-vintageText/75 font-body">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Form */}
            <div className="flex items-center gap-2 pt-1">
              <input 
                type="text" 
                placeholder="Write a supportive reply..." 
                value={commentInputs[post.id] || ''}
                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                className="flex-1 bg-cream/45 border border-borderPink/50 px-3 py-1.5 rounded-full text-xxs font-body"
              />
              <button 
                onClick={() => handleSendComment(post.id)}
                className="w-7 h-7 rounded-full bg-accent/15 hover:bg-accent text-accent hover:text-white flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
