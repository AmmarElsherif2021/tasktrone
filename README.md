**Purpose**

<h3>Tasktrone</h3> leverages Kanban boards to help managers in assembly industries create, assign, visualize, and complete tasks collaboratively. This app, based on the Kanban approach, allows managers to create, schedule, edit, and delete collaborative tasks. Each task serves as a distinct platform where users can view instructional documents and multimedia, upload completed tasks, and review and approve tasks according to their roles. For each project, collaborators can preview the entire project board, including public data and project status.

The main goal of Tasktrone is to provide a simpler way for every worker or employer to interact with tasks and responsibilities displayed on the board.

**Requirements:**

1- <h3>User</h3> can create a <h3>Project , set all project essential data, add other <h3>User</h3>s, each <h3>Project</h3> contains a main <h3>Dashboard</h3> displays main toolbar, Text Announcement space, and Kanban board.
2- Once <h3>Task</h3> created, <h3>User</h3> could be either an <h3>Admin</h3> , <h3>Reviewer</h3> or <h3>Worker</h3> .
3- Each <h3>Task</h3> has 3 phases <h3>Story , <h3>Processing</h3> , <h3>ToBeReviewed</h3> , <h3>Approval , <h3>Done .
4- <h3>Admin</h3> can create, edit, and delete <h3>Task s also can add <h3>Worker s to join this <h3>Task instance.
5- <h3>Worker</h3> can download <h3>Task</h3> files and upload back required files.
6- <h3>Admin</h3> can set any <h3>Worker</h3> as a <h3>Reviewer</h3> who can make approval to the whole task.

**Acronyms and abbreviations:**

1- UID:user ID
2- PID: project ID
3- projectName
4- projectStartDate
5- projectEndDate
6- Story
7- requirementsMaterial

**Functions:**

**Main domain:**

1- createUser(userName, password, email, phone)
2- Login()

**Project domain**

3- createProject(UID, projectName,projectStartDate, projectEndDate )
4- terminateProject()

**User domain**

5- addWorker(UID,PID)

6- confirmJoin()

7- declineJoin()

8- removeWorker()

9- createTask(taskName,UID[],story, requirementsMaterial) 10- editTask()

11- deleteTask()

12- createPost()

13- editPost()

14- deletePost()

15- uploadWork()

16- review()

17- approve()

**Classes and objects:**

1- <h3>User</h3>

2- <h3>Project</h3>

3- <h3>Admin</h3>

4- <h3>Worker</h3>

5- <h3>Reviewer</h3>

6- <h3>Task</h3>

7- <h3>Post</h3>

8- <h3>Material</h3>

**UseCases:**

**ERD: DFD:**

**Sequence Diagram: Test cases:**
