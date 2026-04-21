import supabase from '../../supabaseClient';

export const listTasks = async (projectId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId);

  if (error) throw new Error(`Error fetching tasks: ${error.message}`);
  return data;
};

export const getTaskById = async (taskId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw new Error(`Error retrieving task: ${error.message}`);
  return data;
};

export const createTask = async (projectId, task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...task, project_id: projectId })
    .select();

  if (error) throw new Error(`Error creating task: ${error.message}`);
  return data;
};

export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select();

  if (error) throw new Error(`Error updating task: ${error.message}`);
  return data;
};

export const uploadTaskAttachment = async (taskId, file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${taskId}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('task-attachments')
    .upload(filePath, file);

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
  const FILE_TYPE_MAP = {
    'application/pdf': 'pdf',
    'image/png': 'image', 'image/jpeg': 'image',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
  }
  const mappedType = FILE_TYPE_MAP[file.type] || 'other'
  // Save metadata to attachments table
  const { data, error } = await supabase
    .from('attachments')
    .insert({
      task_id: taskId,
      file_name: fileName,
      original_name: file.name,
      file_type: mappedType,
      file_category: 'design',
      file_size: file.size,
      storage_path: filePath
    });

  if (error) throw new Error(`Attachment record failed: ${error.message}`);
  return data;
};

export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw new Error('Failed to delete task');
};