import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Grid, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import * as api from '../common/api';
import BackdropLoading from '../components/BackdropLoading';
import {useContext} from 'react';
import {AuthContext} from './Auth/AuthProvider';
//-------------------------------------

const UpdateMyProfile = React.memo(props => {
  const {t} = useTranslation();
  const history = useHistory();
  const {enqueueSnackbar} = useSnackbar();
  const auth = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      name: auth.user.name,
      email: auth.user.email,
      password: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(t('errors.is_required')),
      email: yup.string().email(t('errors.invalid_email')),
      password: yup.string(),
    }),
    onSubmit: async values => {
      let data = {
        id: auth.user.id,
        name: values.name,
      };
      if (values.email) data.email = values.email;
      if (values.password) data.password = values.password;
      const res = await api.updateProfile(data);
      if (res.errors) {
        formik.setErrors(res.errors);
      }
      if (res?.success) {
        await auth.updateUser(res.data);
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
    },
  });

  const classes = useStyles();

  return (
    <Container>
      {formik.isSubmitting && <BackdropLoading />}

      <Typography variant="h5" component="h4" gutterBottom>
        {t('update_my_profile')}
      </Typography>

      <Paper
        variant="outlined"
        className={classes.form}
        component="form"
        onSubmit={formik.handleSubmit}>
        <Grid container justify="center">
          <Grid container>
            <Grid container className={classes.groupInput}>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle1">
                  {t('users.form.name')}
                </Typography>
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
                <Typography variant="subtitle1">
                  {t('users.form.email')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  error={formik.touched.email && formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container className={classes.groupInput}>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle1">
                  {t('users.form.password')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  error={formik.touched.password && formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            disableElevation>
            {t('save')}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            disableElevation
            onClick={() => history.goBack()}>
            {t('close')}
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
});

const useStyles = makeStyles(theme => ({
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

export default UpdateMyProfile;
