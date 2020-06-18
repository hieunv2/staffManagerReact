import React from 'react';
//-------------------------------------

const Login = React.lazy(() => import('../containers/Auth/Login'));
const ResetPassword = React.lazy(() =>
  import('../containers/Auth/ResetPassword'),
);
const UserList = React.lazy(() => import('../containers/UserList'));
const UserForm = React.lazy(() => import('../containers/UserForm'));
const UpdateMyProfile = React.lazy(() =>
  import('../containers/UpdateMyProfile'),
);
const DepartmentList = React.lazy(() => import('../containers/DepartmentList'));
const DepartmentForm = React.lazy(() => import('../containers/DepartmentForm'));

// status

const StatusList = React.lazy(() => import('../containers/StatusList'));
const StatusForm = React.lazy(() => import('../containers/StatusForm'));

//task
const TaskList = React.lazy(() => import('../containers/TaskList'));
const TaskForm = React.lazy(() => import('../containers/TaskForm'));

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/reset-password/:token',
    component: ResetPassword,
  },
  {
    path: '/users',
    component: UserList,
    protected: true,
  },
  {
    path: '/users/create',
    component: UserForm,
    protected: true,
  },
  {
    path: '/users/edit/:id',
    component: UserForm,
    protected: true,
  },
  {
    path: '/me/update-profile',
    component: UpdateMyProfile,
    protected: true,
  },
  {
    path: '/departments',
    component: DepartmentList,
    protected: true,
  },
  {
    path: '/departments/create',
    component: DepartmentForm,
    protected: true,
  },
  {
    path: '/departments/edit/:id',
    component: DepartmentForm,
    protected: true,
  },
  {
    path: '/status',
    component: StatusList,
    protected: true,
  },
  {
    path: '/status/create',
    component: StatusForm,
    protected: true,
  },
  {
    path: '/status/edit/:id',
    component: StatusForm,
    protected: true,
  },
  {
    path: '/tasks',
    component: TaskList,
    protected: true,
  },
  {
    path: '/tasks/create',
    component: TaskForm,
    protected: true,
  },
  {
    path: '/tasks/edit/:id',
    component: TaskForm,
    protected: true,
  },
];

export default routes;
