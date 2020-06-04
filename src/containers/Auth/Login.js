import React, {useState, useContext} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useSnackbar} from 'notistack';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import {Alert} from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as api from '../../common/api';
import {AuthContext} from './AuthProvider';
import Copyright from '../../components/Copyright';
//-------------------------------------

const Login = React.memo((props) => {
  const history = useHistory();
  const location = useLocation();
  const [t, i18n] = useTranslation();
  const {user, updateToken} = useContext(AuthContext);
  const {enqueueSnackbar} = useSnackbar();

  const {from} = location.state || {from: {pathname: '/'}};
  const [error, setError] = useState(null);

  if (user) {
    history.replace(from);
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required('Email không được bỏ trống')
        .email('Email không đúng định dạng'),
      password: yup.string().required('Password không được bỏ trống'),
      remember: yup.boolean(),
    }),
    onSubmit: async (values) => {
      setError(null);
      const res = await api.login({
        email: values.email,
        password: values.password,
      });
      if (res?.access_token) {
        await updateToken(res.access_token, values.remember);
        history.replace(from);
      } else if (res?.error === 'Invalid credentials') {
        setError(t('error.invalid_credentials'));
      } else {
        setError(t('error.server_error'));
      }
    },
  });

  const forgotPasswordFormik = useFormik({
    initialValues: {},
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required(t('error.is_required'))
        .email('error.invalid_email'),
    }),
    onSubmit: async (values, {setFieldError}) => {
      const res = await api.forgotPassword({email: values.email});
      if (res?.success) {
        enqueueSnackbar(t('email_sent_to_your_inbox'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      }
      if (res?.error) {
        if (res.error === 'Not found') {
          setFieldError('email', t('error.not_found'));
        } else {
          enqueueSnackbar(t('error.server_error'), {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }
      }
    },
  });

  // dialog forgot password
  const [open, setOpen] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Đăng nhập hệ thống
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            {error && (
              <Alert
                variant="filled"
                severity="warning"
                onClose={() => setError(null)}>
                {t(error)}
              </Alert>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Địa chỉ email"
              autoFocus
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={formik.touched.email && formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={formik.touched.password && formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="remember"
                  color="primary"
                  value={formik.values.remember}
                  onChange={formik.handleChange('remember')}
                />
              }
              label="Ghi nhớ đăng nhập"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}>
              {formik.isSubmitting ? (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              ) : (
                'Đăng nhập'
              )}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={handleClickOpenDialog}>
                  Quên mật khẩu
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <div className={classes.contentDialog}>
            <DialogContentText>
              Nhập email để lấy lại mật khẩu
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              type="email"
              label="Email"
              value={forgotPasswordFormik.values.email}
              onChange={forgotPasswordFormik.handleChange('email')}
              error={
                forgotPasswordFormik.touched.email &&
                forgotPasswordFormik.errors.email
              }
              helperText={
                forgotPasswordFormik.touched.email &&
                forgotPasswordFormik.errors.email
              }
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Huỷ
          </Button>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            disabled={!!forgotPasswordFormik.errors.email}
            onClick={forgotPasswordFormik.handleSubmit}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: 50,
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  contentDialog: {
    minWidth: 380,

    [theme.breakpoints.down('sm')]: {
      minWidth: '90%',
    },
  },
}));

export default Login;
