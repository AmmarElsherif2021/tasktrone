**Purpose**

<h5>Tasktrone</h5> leverages Kanban boards to help managers in assembly industries create, assign, visualize, and complete tasks collaboratively. This app, based on the Kanban approach, allows managers to create, schedule, edit, and delete collaborative tasks. Each task serves as a distinct platform where users can view instructional documents and multimedia, upload completed tasks, and review and approve tasks according to their roles. For each project, collaborators can preview the entire project board, including public data and project status.

The main goal of Tasktrone is to provide a simpler way for every worker or employer to interact with tasks and responsibilities displayed on the board.

**Requirements:**

<ul>
<li> <h5>User</h5> can create a <h5>Project , set all project essential data, add other <h5>User</h5>s, each <h5>Project</h5> contains a main <h5>Dashboard</h5> displays main toolbar, Text Announcement space, and Kanban board.
<li> Once <h5>Task</h5> created, <h5>User</h5> could be either an <h5>Admin</h5> , <h5>Reviewer</h5> or <h5>Worker</h5> .
<li> Each <h5>Task</h5> has 3 phases <h5>Story , <h5>Processing</h5> , <h5>ToBeReviewed</h5> , <h5>Approval , <h5>Done .
<li> <h5>Admin</h5> can create, edit, and delete <h5>Task s also can add <h5>Worker s to join this <h5>Task instance.
<li> <h5>Worker</h5> can download <h5>Task</h5> files and upload back required files.
<li> <h5>Admin</h5> can set any <h5>Worker</h5> as a <h5>Reviewer</h5> who can make approval to the whole task.
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
<li> <h5>User</h5>

<li> <h5>Project</h5>

<li> <h5>Admin</h5>

<li> <h5>Worker</h5>

<li> <h5>Reviewer</h5>

<li> <h5>Task</h5>

<li> <h5>Post</h5>

<li> <h5>Material</h5>
</ul>
**UseCases:**

**ERD: DFD:**

**Sequence Diagram: Test cases:**
