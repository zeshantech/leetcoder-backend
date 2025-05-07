# LeetCode Backend API Endpoints

## Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user information
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/password/reset-request` - Request password reset
- `POST /api/auth/password/reset` - Reset password

## Problems

- `GET /api/problems` - Get all problems (paginated, with filters)
- `GET /api/problems/:id` - Get problem details by ID
- `POST /api/problems` - Create a new problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)
- `GET /api/problems/tags` - Get all problem tags
- `GET /api/problems/difficulties` - Get all difficulty levels

## Submissions

- `POST /api/submissions` - Submit a solution
- `GET /api/submissions` - Get user's submissions (paginated)
- `GET /api/submissions/:id` - Get a specific submission
- `GET /api/problems/:id/submissions` - Get all submissions for a problem
- `GET /api/submissions/status/:id` - Check submission status

## Code Execution

- `POST /api/execute` - Execute code snippet (for testing)
- `GET /api/execute/:id` - Get execution result

## User Progress

- `GET /api/progress` - Get user's overall progress
- `GET /api/progress/problems` - Get solved problems status
- `GET /api/progress/streak` - Get user's current streak

## Contests

- `GET /api/contests` - Get all contests (upcoming, ongoing, past)
- `GET /api/contests/:id` - Get contest details
- `POST /api/contests` - Create a new contest (admin)
- `PUT /api/contests/:id` - Update contest (admin)
- `DELETE /api/contests/:id` - Delete contest (admin)
- `POST /api/contests/:id/register` - Register for a contest
- `GET /api/contests/:id/problems` - Get problems for a contest
- `GET /api/contests/:id/leaderboard` - Get contest leaderboard

## Discussions

- `GET /api/discussions` - Get all discussions
- `GET /api/discussions/:id` - Get specific discussion
- `POST /api/discussions` - Create a new discussion
- `PUT /api/discussions/:id` - Update discussion
- `DELETE /api/discussions/:id` - Delete discussion
- `POST /api/discussions/:id/comments` - Add comment to discussion
- `PUT /api/discussions/:id/comments/:commentId` - Update comment
- `DELETE /api/discussions/:id/comments/:commentId` - Delete comment

## User Lists

- `GET /api/lists` - Get user's problem lists
- `GET /api/lists/:id` - Get specific list
- `POST /api/lists` - Create a new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list
- `POST /api/lists/:id/problems` - Add problem to list
- `DELETE /api/lists/:id/problems/:problemId` - Remove problem from list

## User Management (Admin)

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Change user role

## Stats & Analytics

- `GET /api/stats/problems` - Get problem submission stats
- `GET /api/stats/users` - Get user activity stats
- `GET /api/stats/me` - Get personal stats

## Subscriptions

- `GET /api/subscriptions` - Get subscription plans
- `POST /api/subscriptions` - Subscribe to a plan
- `GET /api/subscriptions/me` - Get current subscription
- `PUT /api/subscriptions/me` - Update subscription
- `DELETE /api/subscriptions/me` - Cancel subscription

## Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings` - Update notification settings
