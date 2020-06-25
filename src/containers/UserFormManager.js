import React, {Fragment, useEffect, useContext} from 'react';
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
import {AuthContext} from '../containers/Auth/AuthProvider';

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

  const {u} = useContext(AuthContext);

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
      gender: '',
      address: '',
      phone: '',
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
      formData.department_id = u?.department_id;
      formData.position = 0;
      if (values.email) formData.email = values.email;
      if (values.password) formData.password = values.password;
      if (values.gender) formData.gender = values.gender;
      if (values.address) formData.address = values.address;
      if (values.phone) formData.phone = values.phone;

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
      if (user.gender) {
        formik.setFieldValue('gender', user.gender);
      }
      if (user.address) {
        formik.setFieldValue('address', user.address);
      }
      if (user.phone) {
        formik.setFieldValue('phone', user.phone);
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
                    <Typography variant="subtitle1">Giới tính</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange('gender')}
                      onBlur={formik.handleBlur('gender')}
                      error={formik.touched.gender && formik.errors.gender}
                      helperText={formik.touched.gender && formik.errors.gender}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Địa chỉ</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange('address')}
                      onBlur={formik.handleBlur('address')}
                      error={formik.touched.address && formik.errors.address}
                      helperText={
                        formik.touched.address && formik.errors.address
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Số điện thoại</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange('phone')}
                      onBlur={formik.handleBlur('phone')}
                      error={formik.touched.phone && formik.errors.phone}
                      helperText={formik.touched.phone && formik.errors.phone}
                      fullWidth
                    />
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
