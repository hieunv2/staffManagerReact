import React, {Fragment, useState, useEffect} from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {useApiFetchData} from '../common/hooks';
import each from 'lodash/each';
import find from 'lodash/find';
import CustomizedTables from '../components/CustomizedTable';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ListAltIcon from '@material-ui/icons/ListAlt';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {positions} from '../common/constants';

//----------------------------------------------------------------

const DepartmentListTask = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [departmentRes, departments] = useApiFetchData({
    resource: 'get-tasks',
  });

  const handlePagination = ({page, per_page}) => {
    refetch({page, per_page});
  };

  const [userRes, users, isFetchedUserData, refetch] = useApiFetchData({
    resource: 'users',
    options: {per_page: 10},
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
      <Fragment>
        <Grid container direction="row" spacing={5} alignItems="center">
          {departments?.map((department) => (
            <Grid
              className={classes.card}
              item
              container
              direction="column"
              xs={3}
              md={3}
              onClick={() => history.push(`/getTask/${department?.id}`)}>
              <Grid item xs={12} sm={12} container alignItems="center">
                <Typography>{department?.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} container alignItems="center">
                Nhân viên: {department?.user}
              </Grid>
              <Grid item xs={12} sm={12} container alignItems="center">
                Công việc: {department?.task}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Fragment>
      <Divider style={{marginTop: 20, marginBottom: 20}} />

      <CustomizedTables
        headerTable={headerTable}
        dataTable={dataTable}
        rowsPerPage={parseInt(userRes?.paging.per_page)}
        page={userRes?.paging.current_page}
        total={userRes?.paging.total}
        onPaginate={handlePagination}
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
        ]}
      />
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    backgroundColor: 'green',
  },
}));

export default DepartmentListTask;
