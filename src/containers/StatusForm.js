import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {useFormik} from 'formik';
import {useSnackbar} from 'notistack';
import * as yup from 'yup';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import * as api from '../common/api';
import {useApiFetchData} from '../common/hooks';
import Loading from '../components/Loading';
import BackdropLoading from '../components/BackdropLoading';
//-------------------------------------

const StatusForm = React.memo((props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();

  const [depRes, status, isFetchedData] = useApiFetchData({
    resource: 'status',
    id: id || null,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Tên trạng thái được bỏ trống'),
    }),
    onSubmit: async (values) => {
      let res;
      if (id) {
        res = await api.updateResource('status', id, {
          name: values.name,
        });
      } else {
        res = await api.createResource('status', {
          name: values.name,
        });
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
        history.push('/status');
      }
    },
  });

  useEffect(() => {
    if (status) {
      formik.setFieldValue('name', status.name);
    }
  }, [status]);

  const classes = useStyles();

  return (
    <Container>
      {formik.isSubmitting && <BackdropLoading />}

      <Typography variant="h5" component="h4" gutterBottom>
        {id ? 'Cập nhật trạng thái' : 'Thêm mới trạng thái'}
      </Typography>

      <Paper
        variant="outlined"
        className={classes.form}
        component="form"
        onSubmit={formik.handleSubmit}>
        {!isFetchedData ? (
          <Loading />
        ) : (
          <Fragment>
            <Grid container justify="center">
              <Grid container>
                <Grid container className={classes.groupInput}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle1">Tên trạng thái</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                Xoá
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
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default StatusForm;
