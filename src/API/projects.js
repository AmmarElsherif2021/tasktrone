import supabase from '../../supabaseClient';

export const listProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('created_by', userId);

  if (error) throw new Error(`Error fetching projects: ${error.message}`);
  return data;
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    // 1. Create the project first
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: projectData.title,
        description: projectData.description,
        start_date: projectData.start_date,
        target_completion_date: projectData.target_completion_date,
        created_by: projectData.created_by,
        project_manager: projectData.project_manager || projectData.created_by,
        status: 'active',
        
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // 2. Create a default board for the project
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .insert({
        project_id: project.id,
        name: 'Default Board',
        is_default: true,
        wip_limit: projectData.wip_limit || 5,
        phase: projectData.current_phase || 'concept_design',
      })
      .select()
      .single();

    if (boardError) throw boardError;

    // 3. Add the project ID to the creator's projects array
    const { error: userUpdateError } = await supabase.rpc('append_to_array', {
      table_name: 'users',
      column_name: 'projects',
      id: projectData.created_by,
      value: project.id  // Changed from board.id to project.id
    });

    if (userUpdateError) {
      console.warn('Warning: Could not update user projects array:', userUpdateError);
    }

    // 4. Add the creator as a project admin
    const { error: creatorMemberError } = await supabase
      .from('project_members')
      .insert({
        project_id: project.id,
        user_id: projectData.created_by,
        role: 'admin'
      });

    if (creatorMemberError) {
      console.warn('Warning: Could not add creator as project member:', creatorMemberError);
    }

    // 5. Add other members if provided
    if (projectData.members && projectData.members.length > 0) {
      const memberInserts = projectData.members
        .filter(member => member.user_id !== projectData.created_by) // Don't duplicate creator
        .map(member => ({
          project_id: project.id,
          user_id: member.user_id,
          role: member.role || 'worker'
        }));

      if (memberInserts.length > 0) {
        // Add project ID to each member's projects array
        for (const member of memberInserts) {
          await supabase.rpc('append_to_array', {
            table_name: 'users',
            column_name: 'projects',
            id: member.user_id,
            value: project.id  // Changed from board.id to project.id
          }).then(({ error }) => {
            if (error) {
              console.warn(`Warning: Could not update projects array for user ${member.user_id}:`, error);
            }
          });
        }

        const { error: membersError } = await supabase
          .from('project_members')
          .insert(memberInserts);

        if (membersError) {
          console.warn('Warning: Some members could not be added:', membersError);
        }
      }
    }

    return { ...project, board_id: board.id };
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

export const getProjectById = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) throw new Error(`Error fetching project: ${error.message}`);
  return data;
};

export const updateProject = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select();

  if (error) throw new Error(`Error updating project: ${error.message}`);
  return data;
};

export const deleteProject = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw new Error(`Error deleting project: ${error.message}`);
};

export const updateTasksCycleTime = async () => {
  // This would be handled via database triggers in Supabase
  console.warn('Cycle time updates should be handled via database triggers');
  return [];
};