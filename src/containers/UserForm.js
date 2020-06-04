import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {useFormik} from 'formik';
import {useSnackbar} from 'notistack';
import * as yup from 'yup';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import * as api from '../common/api';
import {useApiFetchData} from '../common/hooks';
import {positions} from '../common/constants';
import Loading from '../components/Loading';
import BackdropLoading from '../components/BackdropLoading';
//-------------------------------------

const UserForm = React.memo((props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();

  const [depRes, departments, isFetchedDepartmentData] = useApiFetchData({
    resource: 'departments',
    options: {per_page: 1000},
  });
  const [userRes, user, isFetchedUserData] = useApiFetchData({
    resource: 'users',
    id: id || null,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      departmentId: '',
      position: '',
      email: '',
      password: '',
    },
    validationSchema: id // id ? schema for update : schema for create
      ? yup.object().shape({
          name: yup.string(),
          position: yup.string(),
          email: yup.string().email('Email không đúng định dang'),
          password: yup.string(),
        })
      : yup.object().shape({
          name: yup.string().required('Tên không được bỏ trống'),
          position: yup.string().required('Chức vụ không được bỏ trống'),
          email: yup
            .string()
            .required('Email không được bỏ trống')
            .email('Email không đúng định dạng'),
          password: yup.string().required('Password không được bỏ trống'),
        }),
    onSubmit: async (values) => {
      let formData = {};
      if (values.name) formData.name = values.name;
      if (values.departmentId) formData.department_id = values.departmentId;
      if (values.position) formData.position = values.position;
      if (values.email) formData.email = values.email;
      if (values.password) formData.password = values.password;

      let res;
      if (id) {
        formData.id = id;
        res = await api.updateResource('users', id, formData);
      } else {
        res = await api.createResource('users', formData);
      }
      if (res.errors) {
        formik.setErrors(res.errors);
      }
      if (res?.success) {
        enqueueSnackbar(t('update_success'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      }
      if (res?.error) {
        enqueueSnackbar(t('update_error'), {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      }
      if (res.success) {
        history.push('/users');
      }
    },
  });

  useEffect(() => {
    if (user && departments) {
      formik.setFieldValue('name', user.name);
      if (user.department_id) {
        formik.setFieldValue('departmentId', user.department_id);
      }
      if (user.position) {
        formik.setFieldValue('position', user.position);
      }
      formik.setFieldValue('email', user.email);
    }
  }, [user, departments]);

  const classes = useStyles();

  return (
    <Container>
      {formik.isSubmitting && <BackdropLoading />}

      <Typography component="h4" variant="h5" gutterBottom>
        {id ? t('users.update_user') : t('users.create_user')}
      </Typography>

      <Paper
        variant="outlined"
        className={classes.form}
        component="form"
        onSubmit={formik.handleSubmit}>
        {!isFetchedDepartmentData || !isFetchedUserData ? (
          <Loading />
        ) : (
          <Fragment>
            <Grid container justify="center">
              <Grid container>
                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Tên nhân viên</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange('name')}
                      onBlur={formik.handleBlur('name')}
                      error={formik.touched.name && formik.errors.name}
                      helperText={formik.touched.name && formik.errors.name}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Phòng ban</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {isFetchedDepartmentData && (
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        name="departmentId"
                        value={formik.values.departmentId}
                        onChange={formik.handleChange('departmentId')}
                        onBlur={formik.handleBlur('departmentId')}
                        error={
                          formik.touched.departmentId &&
                          formik.errors.departmentId
                        }
                        helperText={
                          formik.touched.departmentId &&
                          formik.errors.departmentId
                        }
                        fullWidth>
                        <MenuItem value="">{t('none')}</MenuItem>
                        {departments?.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                </Grid>

                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Chức vụ</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      variant="outlined"
                      size="small"
                      name="position"
                      value={formik.values.position}
                      onChange={formik.handleChange('position')}
                      onBlur={formik.handleBlur('position')}
                      error={formik.touched.position && formik.errors.position}
                      helperText={
                        formik.touched.position && formik.errors.position
                      }
                      fullWidth>
                      <MenuItem key={positions.STAFF} value={positions.STAFF}>
                        Nhân viên
                      </MenuItem>
                      <MenuItem
                        key={positions.MANAGER}
                        value={positions.MANAGER}>
                        Quản trị viên
                      </MenuItem>
                      <MenuItem key={positions.ADMIN} value={positions.ADMIN}>
                        Admin
                      </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container item xs={12} md={8}>
                  <Paper
                    component="fieldset"
                    variant="outlined"
                    className={classes.fieldset}>
                    <legend>
                      <Typography variant="h6">Thông tin đăng nhập</Typography>
                    </legend>
                    <Grid container>
                      <Grid container className={classes.groupInput}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">Email</Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            name="email"
                            size="small"
                            value={formik.values.email}
                            onChange={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                            error={formik.touched.email && formik.errors.email}
                            helperText={
                              formik.touched.email && formik.errors.email
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid container className={classes.groupInput}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">Mật khẩu</Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange('password')}
                            onBlur={formik.handleBlur('password')}
                            error={
                              formik.touched.password && formik.errors.password
                            }
                            helperText={
                              formik.touched.password && formik.errors.password
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center">
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disableElevation>
                Lưu
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                disableElevation
                onClick={() => history.goBack()}>
                Đóng
              </Button>
            </Grid>
          </Fragment>
        )}
      </Paper>
    </Container>
  );
});

const useStyles = makeStyles((theme) => ({
  form: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  groupInput: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },

    '& p': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  fieldset: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
}));

export default UserForm;
