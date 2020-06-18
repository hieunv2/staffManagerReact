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

  const [statusRes, status, isFetchedStatusData] = useApiFetchData({
    resource: 'status',
    options: {per_page: 1000},
  });
  const [taskRes, task, isFetchedTaskData] = useApiFetchData({
    resource: 'tasks',
    id: id || null,
  });

  const [userRes, users, isFetchedUserData] = useApiFetchData({
    resource: 'users',
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      creator: '',
      startDay: '',
      endDay: '',
      progress: '',
      status: '',
    },
    validationSchema: id // id ? schema for update : schema for create
      ? yup.object().shape({
          name: yup.string(),
        })
      : yup.object().shape({
          name: yup.string().required('Tên không được bỏ trống'),
        }),
    onSubmit: async (values) => {
      let formData = {};
      if (values.name) formData.name = values.name;
      if (values.description) formData.description = values.description;
      if (values.creator) formData.creator = values.creator;
      if (values.startDay) formData.startDay = values.startDay;
      if (values.endDay) formData.endDay = values.endDay;
      if (values.progress) formData.progress = values.progress;
      if (values.status) formData.status = values.status;

      let res;
      if (id) {
        formData.id = id;
        res = await api.updateResource('tasks', id, formData);
      } else {
        res = await api.createResource('tasks', formData);
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
        history.push('/tasks');
      }
    },
  });

  useEffect(() => {
    if (task && status) {
      formik.setFieldValue('name', task.name);
      if (task.name) {
        formik.setFieldValue('statusId', task.status_id);
      }
      if (task.description) {
        formik.setFieldValue('description', task.description);
      }
      if (task.start_day) {
        formik.setFieldValue('startDay', task.start_day);
      }
      if (task.end_day) {
        formik.setFieldValue('endDay', task.end_day);
      }
      if (task.end_day) {
        formik.setFieldValue('endDay', task.end_day);
      }
      if (task.creator) {
        formik.setFieldValue('creator', task.creator);
      }
      if (task.progress) {
        formik.setFieldValue('progress', task.progress);
      }
    }
  }, [task, status]);

  const classes = useStyles();

  return (
    <Container>
      {formik.isSubmitting && <BackdropLoading />}

      <Typography component="h4" variant="h5" gutterBottom>
        {id ? 'Sửa công việc' : 'Thêm mới công việc'}
      </Typography>

      <Paper
        variant="outlined"
        className={classes.form}
        component="form"
        onSubmit={formik.handleSubmit}>
        {!isFetchedTaskData || !isFetchedStatusData ? (
          <Loading />
        ) : (
          <Fragment>
            <Grid container justify="center">
              <Grid container>
                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Tên công việc</Typography>
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
                    <Typography variant="subtitle1">Mô tả</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange('description')}
                      onBlur={formik.handleBlur('description')}
                      error={
                        formik.touched.description && formik.errors.description
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1">Trạng thái</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {isFetchedStatusData && (
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        name="statusId"
                        value={formik.values.statusId}
                        onChange={formik.handleChange('statusId')}
                        onBlur={formik.handleBlur('statusId')}
                        error={
                          formik.touched.statusId && formik.errors.statusId
                        }
                        helperText={
                          formik.touched.statusId && formik.errors.statusId
                        }
                        fullWidth>
                        <MenuItem value="">{t('none')}</MenuItem>
                        {status?.map((item) => (
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
                    <Typography variant="subtitle1">Người tạo</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {isFetchedStatusData && (
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        name="creator"
                        value={formik.values.creator}
                        onChange={formik.handleChange('creator')}
                        onBlur={formik.handleBlur('creator')}
                        error={formik.touched.creator && formik.errors.creator}
                        helperText={
                          formik.touched.creator && formik.errors.creator
                        }
                        fullWidth>
                        <MenuItem value="">{t('none')}</MenuItem>
                        {users?.map((item) => (
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
                    <Typography variant="subtitle1">Tiến độ</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      name="progress"
                      value={formik.values.progress}
                      onChange={formik.handleChange('progress')}
                      onBlur={formik.handleBlur('progress')}
                      error={formik.touched.progress && formik.errors.progress}
                      helperText={
                        formik.touched.progress && formik.errors.progress
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
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
