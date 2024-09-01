**Purpose**

<p>
<strong>Tasktrone</strong> leverages Kanban boards to help managers in assembly industries create, assign, visualize, and complete tasks collaboratively. This app, based on the Kanban approach, allows managers to create, schedule, edit, and delete collaborative tasks. Each task serves as a distinct platform where users can view instructional documents and multimedia, upload completed tasks, and review and approve tasks according to their roles. For each project, collaborators can preview the entire project board, including public data and project status.

The main goal of Tasktrone is to provide a simpler way for every worker or employer to interact with tasks and responsibilities displayed on the board.

</p>
**Requirements:**

<ul>
<li> <strong>User</strong> can create a <strong>Project , set all project essential data, add other <strong>User</strong>s, each <strong>Project</strong> contains a main <strong>Dashboard</strong> displays main toolbar, Text Announcement space, and Kanban board.
<li> Once <strong>Task</strong> created, <strong>User</strong> could be either an <strong>Admin</strong> , <strong>Reviewer</strong> or <strong>Worker</strong> .
<li> Each <strong>Task</strong> has 3 phases <strong>Story , <strong>Processing</strong> , <strong>ToBeReviewed</strong> , <strong>Approval , <strong>Done .
<li> <strong>Admin</strong> can create, edit, and delete <strong>Task s also can add <strong>Worker s to join this <strong>Task instance.
<li> <strong>Worker</strong> can download <strong>Task</strong> files and upload back required files.
<li> <strong>Admin</strong> can set any <strong>Worker</strong> as a <strong>Reviewer</strong> who can make approval to the whole task.
</ul>
**Acronyms and abbreviations:**
<ul>
<li> UID:user ID
<li> PID: project ID
<li> projectName
<li> projectStartDate
<li> projectEndDate
<li> Story
<li> requirementsMaterial
</ul>

**Functions:**

**Main domain:**

<ul>
<li> createUser(userName, password, email, phone)
<li> Login()
</ul>

**Project domain**

<ul>
<li> createProject(UID, projectName,projectStartDate, projectEndDate )
<li> terminateProject()
</ul>

**User domain**

<ul>
<li> addWorker(UID,PID)

<li> confirmJoin()

<li> declineJoin()

<li> removeWorker()

<li> createTask(taskName,UID[],story, requirementsMaterial) 1<li> editTask()

<li> deleteTask()

<li> createPost()

<li> editPost()

<li> deletePost()

<li> uploadWork()

<li> review()

<li> approve()
</ul>
**Classes and objects:**
<ul>
<li> <strong>User</strong>

<li> <strong>Project</strong>

<li> <strong>Admin</strong>

<li> <strong>Worker</strong>

<li> <strong>Reviewer</strong>

<li> <strong>Task</strong>

<li> <strong>Post</strong>

<li> <strong>Material</strong>
</ul>
**UseCases:**

**ERD: DFD:**

**Sequence Diagram: Test cases:**
