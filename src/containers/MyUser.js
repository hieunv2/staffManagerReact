import React, {Fragment, useState, useEffect, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useFormik} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ListAltIcon from '@material-ui/icons/ListAlt';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import each from 'lodash/each';
import find from 'lodash/find';

import * as api from '../common/api';
import {positions} from '../common/constants';
import {useApiFetchData} from '../common/hooks';
import {useDialog} from '../components/Dialog';
import Loading from '../components/Loading';
import BackdropLoading from '../components/BackdropLoading';
import CustomizedTables from '../components/CustomizedTable';
import {AuthContext} from '../containers/Auth/AuthProvider';
//-------------------------------------

const MyUser = React.memo((props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const dialog = useDialog();

  const [isSearching, setSearching] = useState(false);
  const [backdropLoading, setBackdropLoading] = useState(false);

  const {user} = useContext(AuthContext);

  const [userRes, users, isFetchedUserData, refetch] = useApiFetchData({
    resource: `my-user/${user?.department_id}`,
    options: {per_page: 10},
  });
  const [depRes, departments, isFetchedDepartmentData] = useApiFetchData({
    resource: 'departments',
    options: {per_page: 1000},
  });
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    if (users && departments) {
      let data = [];
      each(users, (u) => {
        let position = 'Nhân viên';
        if (u.position === positions.MANAGER) position = 'Quản trị viên';
        else if (u.position === positions.ADMIN) position = 'Admin';

        let dep = find(departments, (dep) => dep.id === u.department_id);
        let department = dep ? dep.name : '';

        data.push({
          id: u.id,
          name: u.name,
          gender: u.gender,
          phone: u.phone,
          email: u.email,
          department,
          position,
          address: u.address,
        });
      });
      setDataTable(data);
    }
  }, [users, departments]);

  const formik = useFormik({
    initialValues: {
      name: '',
      deparmentId: '',
    },
    onSubmit: async (values) => {
      setSearching(true);
      let formData = {};
      if (values.name) {
        formData.name = values.name;
      }
      if (user?.department_id) {
        formData.department_id = user?.department_id;
      }

      const res = await api.searchUser(formData);
      if (res?.success) {
        let data = [];
        each(res.data, (u) => {
          let position = 'Nhân viên';
          if (u.position === positions.MANAGER) position = 'Quản trị viên';
          else if (u.position === positions.ADMIN) position = 'Admin';

          let dep = find(departments, (dep) => dep.id === u.department_id);
          let department = dep ? dep.name : '';
          data.push({
            id: u.id,
            name: u.name,
            gender: u.gender,
            phone: u.phone,
            email: u.email,
            department,
            position,
            address: u.address,
          });
        });
        setDataTable(data);
      }
    },
  });

  const handleResetSearchForm = () => {
    formik.resetForm();
    refetch({per_page: 10});
    setSearching(false);
  };

  const handlePagination = ({page, per_page}) => {
    refetch({page, per_page});
  };

  const handleDeleteUser = async (id) => {
    try {
      await dialog({
        type: 'confirm',
        title: t('are_you_sure'),
        description: t('you_want_to_delete_this_item'),
        confirmationText: t('ok'),
        cancellationText: t('cancel'),
        confirmationButtonProps: {
          variant: 'contained',
          color: 'secondary',
          disableElevation: true,
        },
        cancellationButtonProps: {
          variant: 'contained',
          disableElevation: true,
        },
      });
      setBackdropLoading(true);
      const res = await api.deleteResource('users', id);
      if (res.success) {
        refetch();
      }
      setBackdropLoading(false);
    } catch (e) {}
  };

  const classes = useStyles();

  const headerTable = [
    {
      label: 'Tên nhân viên',
      field: 'name',
    },
    {
      label: 'Giới tính',
      field: 'gender',
    },
    {
      label: 'SĐT',
      field: 'phone',
    },
    {
      label: 'Email',
      field: 'email',
    },
    {
      label: 'Phòng ban',
      field: 'department',
    },
    {
      label: 'Chức vụ',
      field: 'position',
    },
    {
      label: 'Địa chỉ',
      field: 'address',
    },
  ];

  return (
    <Container>
      {(backdropLoading || formik.isSubmitting) && <BackdropLoading />}

      <Grid
        container
        direction="row"
        alignItems="flex-end"
        justify="space-between">
        <Grid item>
          <Typography variant="h5" component="h4" gutterBottom>
            Danh sách nhân viên
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            className={classes.topButton}
            startIcon={<AddIcon />}
            onClick={() => history.push('/users/create')}>
            Thêm mới
          </Button>
          <Button
            variant="contained"
            className={classes.topButton}
            startIcon={<ListAltIcon />}
            onClick={() => history.push('/departments')}>
            Phòng ban
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs>
          <Paper variant="outlined" className={classes.paperWrapper}>
            {!isFetchedUserData || !isFetchedDepartmentData ? (
              <Loading />
            ) : (
              <Fragment>
                <Paper
                  elevation={1}
                  component="fieldset"
                  className={classes.fieldset}>
                  <legend>Tìm kiếm</legend>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid
                      container
                      direction="row"
                      className={classes.formFilter}
                      spacing={3}
                      alignItems="center">
                      <Grid item container direction="row" xs={12} md={6}>
                        <Grid item xs={12} sm={4} container alignItems="center">
                          <Typography>Họ và tên</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} container alignItems="center">
                          <TextField
                            variant="outlined"
                            margin="normal"
                            size="small"
                            fullWidth
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange('name')}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      className={classes.buttonFilter}
                      color="primary"
                      variant="contained"
                      disableElevation>
                      Tìm kiếm
                    </Button>
                    <Button
                      className={classes.buttonFilter}
                      variant="contained"
                      disableElevation
                      onClick={handleResetSearchForm}>
                      Làm mới
                    </Button>
                  </form>
                </Paper>

                <CustomizedTables
                  headerTable={headerTable}
                  dataTable={dataTable}
                  rowsPerPage={parseInt(userRes.paging.per_page)}
                  page={userRes.paging.current_page}
                  total={userRes.paging.total}
                  onPaginate={handlePagination}
                  disablePagination={isSearching}
                  actions={[
                    {
                      component: (
                        <Button
                          className={classes.tableActionButton}
                          variant="contained"
                          size="small"
                          disableElevation
                          startIcon={<EditIcon />}>
                          Sửa
                        </Button>
                      ),
                      onClick: (id) => history.push(`/users/edit/${id}`),
                    },
                    {
                      component: (
                        <Button
                          className={classes.tableActionButton}
                          variant="contained"
                          color="secondary"
                          size="small"
                          disableElevation
                          startIcon={<DeleteIcon />}>
                          Xoá
                        </Button>
                      ),
                      onClick: (id) => handleDeleteUser(id),
                    },
                  ]}
                />
              </Fragment>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
});

const useStyles = makeStyles((theme) => ({
  topButton: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {},
  },
  paperWrapper: {
    padding: theme.spacing(3),
  },
  fieldset: {
    marginBottom: theme.spacing(3),
    border: 'none',
    padding: theme.spacing(2),
  },
  formFilter: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  buttonFilter: {
    marginRight: theme.spacing(2),
  },
  tableActionButton: {
    marginLeft: theme.spacing(2),
  },
}));

export default MyUser;
