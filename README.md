**Purpose**

<h5>Tasktrone</h5> leverages Kanban boards to help managers in assembly industries create, assign, visualize, and complete tasks collaboratively. This app, based on the Kanban approach, allows managers to create, schedule, edit, and delete collaborative tasks. Each task serves as a distinct platform where users can view instructional documents and multimedia, upload completed tasks, and review and approve tasks according to their roles. For each project, collaborators can preview the entire project board, including public data and project status.

The main goal of Tasktrone is to provide a simpler way for every worker or employer to interact with tasks and responsibilities displayed on the board.

**Requirements:**

1- <h5>User</h5> can create a <h5>Project , set all project essential data, add other <h5>User</h5>s, each <h5>Project</h5> contains a main <h5>Dashboard</h5> displays main toolbar, Text Announcement space, and Kanban board.
2- Once <h5>Task</h5> created, <h5>User</h5> could be either an <h5>Admin</h5> , <h5>Reviewer</h5> or <h5>Worker</h5> .
3- Each <h5>Task</h5> has 3 phases <h5>Story , <h5>Processing</h5> , <h5>ToBeReviewed</h5> , <h5>Approval , <h5>Done .
4- <h5>Admin</h5> can create, edit, and delete <h5>Task s also can add <h5>Worker s to join this <h5>Task instance.
5- <h5>Worker</h5> can download <h5>Task</h5> files and upload back required files.
6- <h5>Admin</h5> can set any <h5>Worker</h5> as a <h5>Reviewer</h5> who can make approval to the whole task.

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

1- <h5>User</h5>

2- <h5>Project</h5>

3- <h5>Admin</h5>

4- <h5>Worker</h5>

5- <h5>Reviewer</h5>

6- <h5>Task</h5>

7- <h5>Post</h5>

8- <h5>Material</h5>

**UseCases:**

**ERD: DFD:**

**Sequence Diagram: Test cases:**
