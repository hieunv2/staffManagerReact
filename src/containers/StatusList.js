import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import ListAltIcon from '@material-ui/icons/ListAlt';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import each from 'lodash/each';

import * as api from '../common/api';
import {useApiFetchData} from '../common/hooks';
import {useDialog} from '../components/Dialog';
import Loading from '../components/Loading';
import BackdropLoading from '../components/BackdropLoading';
import CustomizedTables from '../components/CustomizedTable';
//-------------------------------------

const StatusList = React.memo((props) => {
  const {t} = useTranslation();
  const history = useHistory();
  const dialog = useDialog();

  const [dataTable, setDataTable] = useState([]);
  const [backdropLoading, setBackdropLoading] = useState(false);

  const [
    depRes,
    status,
    isFetchedStatusData,
    refetch,
  ] = useApiFetchData({
    resource: 'status',
  });

  useEffect(() => {
    if (status) {
      let data = [];
      each(status, (dep) => {
        data.push({
          id: dep.id,
          name: dep.name,
        });
      });
      setDataTable(data);
    }
  }, [status]);

  const handlePagination = ({page, per_page}) => {
    refetch({page, per_page});
  };

  const handleDeleteDepartment = async (id) => {
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
      const res = await api.deleteResource('status', id);
      if (res.success) {
        refetch();
      }
      setBackdropLoading(false);
    } catch (e) {}
  };

  const classes = useStyles();

  const headerTable = [
    {
      label: 'Tên trạng thái',
      field: 'name',
    },
  ];

  return (
    <Container>
      {backdropLoading && <BackdropLoading />}

      <Grid
        container
        direction="row"
        alignItems="flex-end"
        justify="space-between">
        <Grid item>
          <Typography variant="h5" component="h4" gutterBottom>
            Danh sách trạng thái
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            className={classes.topButton}
            startIcon={<AddIcon />}
            onClick={() => history.push('/status/create')}>
            Thêm mới
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs>
          <Paper variant="outlined" className={classes.paperWrapper}>
            {!isFetchedStatusData ? (
              <Loading />
            ) : (
              <CustomizedTables
                headerTable={headerTable}
                dataTable={dataTable}
                rowsPerPage={parseInt(depRes.paging.per_page)}
                page={depRes.paging.current_page}
                total={depRes.paging.total}
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
                    onClick: (id) => history.push(`/status/edit/${id}`),
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
                    onClick: (id) => handleDeleteDepartment(id),
                  },
                ]}
              />
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
  },
  paperWrapper: {
    padding: theme.spacing(3),
  },
  tableActionButton: {
    marginLeft: theme.spacing(2),
  },
}));

export default StatusList;
