import React, {useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import * as api from '../../common/api';
import {AuthContext} from './AuthProvider';
import Copyright from '../../components/Copyright';
//-------------------------------------

const ResetPassword = React.memo(props => {
  const history = useHistory();
  const {t} = useTranslation();
  const {token} = useParams();
  const {updateToken} = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: yup.object().shape({
      password: yup.string().required(t('error.is_required')),
    }),
    onSubmit: async (values, {setErrors}) => {
      const res = await api.resetPassword({token, password: values.password});
      if (res?.success) {
        await updateToken(res.access_token);
        history.push('/');
      }
      if (res?.errors) {
        setErrors(res.errors);
      }
    },
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <Paper variant="outlined" className={classes.paper}>
          <Typography component="h4" variant="subtitle1">
            {t('reset_password')}
          </Typography>
          <Divider />
          <TextField
            fullWidth
            label={t('login.password')}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            error={formik.touched.password && formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={formik.handleSubmit}>
            {formik.isSubmitting ? (
              <CircularProgress size={24} className={classes.buttonProgress} />
            ) : (
              t('save')
            )}
          </Button>
        </Paper>
        <Copyright />
      </Container>
    </div>
  );
});

const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
}));

export default ResetPassword;
