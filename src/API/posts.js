import supabase from '../../supabaseClient';

export const getPosts = async (projectId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Failed to fetch posts');
  return data;
};

export const getTaskPosts = async (projectId, taskId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .eq('task_id', taskId);

  if (error) throw new Error('Failed to fetch task posts');
  return data;
};

export const getPostById = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) throw new Error('Failed to fetch post');
  return data;
};

export const createPost = async (projectId,authorId, postData) => {
  const { data, error } = await supabase
  .from('comments')
  .insert({ ...postData,author_id:authorId, project_id: projectId })
  .select()
  if (error) throw new Error('Failed to create post');
  return data;
};

export const createTaskPost = async (projectId, taskId, authorId, postData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ ...postData, author_id: authorId, project_id: projectId, task_id: taskId }).select();
  if (error) throw new Error('Failed to create task post');
  return data;
};

export const updatePost = async (postId, postData) => {
  const { data, error } = await supabase
    .from('comments')
    .update(postData)
    .eq('id', postId);

  if (error) throw new Error('Failed to update post');
  return data;
};

export const deletePost = async (postId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', postId);

  if (error) throw new Error('Failed to delete post');
};

export const getLastPostByAuthor = async (projectId, authorId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw new Error('Failed to fetch latest post');
  return data[0] || null;
};