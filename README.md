**Purpose**

Tasktrone leverages Kanban boards to help managers in assembly industries create, assign, visualize, and complete tasks collaboratively. This app, based on the Kanban approach, allows managers to create, schedule, edit, and delete collaborative tasks. Each task serves as a distinct platform where users can view instructional documents and multimedia, upload completed tasks, and review and approve tasks according to their roles. For each project, collaborators can preview the entire project board, including public data and project status.

The main goal of Tasktrone is to provide a simpler way for every worker or employer to interact with tasks and responsibilities displayed on the board.

**Requirements:**

1- ##User can create a ##Project , set all project essential data, add other ##User s, each ##Project contains a main ##Dashboard displays main toolbar, Text Announcement space, and Kanban board

2- Once ##Task created, ##User could be either an ##Admin , ##Reviewer or ##Worker . 3- Each ##Task has 3 phases ##Story , ##Processing , ##ToBeReviewed , ##Approval , ##Done .

4- ##Admin can create, edit, and delete ##Task s also can add ##Worker s to join this ##Task instance.

5- ##Worker can download ##Task files and upload back required files.

6- ##Admin can set any ##Worker as a ##Reviewer who can make approval to the whole task.

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

1- createUser(userName, password, email, phone) 2- Login()

**Project domain**

3- createProject(UID, projectName,projectStartDate, projectEndDate ) 4- terminateProject()

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

1- ##User

2- ##Project 3- ##Admin 4- ##Worker 5- ##Reviewer 6- ##Task

7- ##Post

8- ##Material

**UseCases:**

**ERD: DFD:**

**Sequence Diagram: Test cases:**
