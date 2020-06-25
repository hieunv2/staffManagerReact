import React, {Fragment, useState, useEffect, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
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
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import {AuthContext} from './Auth/AuthProvider';

import each from 'lodash/each';
import find from 'lodash/find';

import * as api from '../common/api';
import {positions} from '../common/constants';
import {useApiFetchData} from '../common/hooks';
import {useDialog} from '../components/Dialog';
import Loading from '../components/Loading';
import BackdropLoading from '../components/BackdropLoading';
import CustomizedTables from '../components/CustomizedTable';
//-------------------------------------

const DepartmentTask = React.memo((props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const {id} = useParams();

  const dialog = useDialog();

  const [isSearching, setSearching] = useState(false);
  const [backdropLoading, setBackdropLoading] = useState(false);
  const [personName, setPersonName] = useState([]);

  const {user} = useContext(AuthContext);
  console.log('user', user);

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  const [userRes, users, isFetchedUserData] = useApiFetchData({
    resource: 'users',
  });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [taskRes, tasks, isFetchedTaskData, refetch] = useApiFetchData({
    resource: `get-my-tasks/${id}`,
  });
  const [statusRes, status, isFetchedStatusData] = useApiFetchData({
    resource: 'status',
    options: {per_page: 1000},
  });
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    if (tasks) {
      let data = [];
      each(tasks, (u) => {
        data.push({
          id: u.id,
          name: u.name,
          creator: u?.creator?.name,
          startDay: u?.start_day,
          endDay: u?.end_day,
          description: u?.description,
          progress: u?.progress,
          status: u?.status?.name,
          date: u?.created_at || u?.updated_at,
        });
      });
      setDataTable(data);
    }
  }, [tasks]);

  const formik = useFormik({
    initialValues: {
      name: '',
      statusId: '',
    },
    onSubmit: async (values) => {
      setSearching(true);
      let formData = {};
      if (values.name) {
        formData.name = values.name;
      }
      if (values.statusId) {
        formData.status_id = values.statusId;
      }
      let ids = personName.map((p) => p.id);
      if (ids.length > 0) {
        formData.users = JSON.stringify(ids);
      }
      const res = await api.searchTask(formData);
      if (res?.success) {
        let data = [];
        each(res.data, (u) => {
          data.push({
            id: u.id,
            name: u.name,
            creator: u?.creator?.name,
            startDay: u?.start_day,
            endDay: u?.end_day,
            description: u?.description,
            progress: u?.progress,
            status: u?.status?.name,
            date: u?.created_at || u?.updated_at,
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
      const res = await api.deleteResource('tasks', id);
      if (res.success) {
        refetch();
      }
      setBackdropLoading(false);
    } catch (e) {}
  };

  const classes = useStyles();

  const headerTable = [
    {
      label: 'Tên công việc',
      field: 'name',
    },
    {
      label: 'Mô tả',
      field: 'description',
    },
    {
      label: 'Trạng thái',
      field: 'status',
    },
    {
      label: 'Người tạo',
      field: 'creator',
    },
    {
      label: 'Ngày bắt đầu',
      field: 'startDay',
    },
    {
      label: 'Ngày kết thúc',
      field: 'endDay',
    },
    {
      label: 'Tiến độ',
      field: 'progress',
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
            Danh sách công việc trong phòng
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            className={classes.topButton}
            startIcon={<AddIcon />}
            onClick={() => history.push('/tasks/create')}>
            Thêm mới
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs>
          <Paper variant="outlined" className={classes.paperWrapper}>
            {!isFetchedTaskData || !isFetchedStatusData ? (
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
                          <Typography>Tên công việc</Typography>
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
                      <Grid
                        item
                        container
                        direction="row"
                        xs={12}
                        md={6}
                        container
                        alignItems="center">
                        <Grid item xs={12} sm={3} container alignItems="center">
                          <Typography>Trạng thái</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} container alignItems="center">
                          {isFetchedStatusData && (
                            <TextField
                              select
                              variant="outlined"
                              size="small"
                              fullWidth
                              name="statusId"
                              value={formik.values.statusId || ''}
                              onChange={formik.handleChange('statusId')}>
                              {status.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction="row"
                        xs={12}
                        md={6}
                        container
                        alignItems="center">
                        <Grid item xs={12} sm={3} container alignItems="center">
                          <Typography>Người thực hiện</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} container alignItems="center">
                          {isFetchedStatusData && (
                            <Select
                              labelId="demo-mutiple-chip-label"
                              id="demo-mutiple-chip"
                              multiple
                              value={personName}
                              onChange={handleChange}
                              input={<Input id="select-multiple-chip" />}
                              renderValue={(selected) => (
                                <div className={classes.chips}>
                                  {selected.map((item) => (
                                    <Chip
                                      key={item.id}
                                      label={item.name}
                                      className={classes.chip}
                                    />
                                  ))}
                                </div>
                              )}
                              MenuProps={MenuProps}>
                              {users?.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
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
                  rowsPerPage={parseInt(taskRes.paging.per_page)}
                  page={taskRes.paging.current_page}
                  total={taskRes.paging.total}
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
                      onClick: (id) => history.push(`/tasks/edit/${id}`),
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

export default DepartmentTask;
