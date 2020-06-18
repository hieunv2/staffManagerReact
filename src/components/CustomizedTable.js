import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {withStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
  },
  body: {
    // fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    // '&:nth-of-type(odd)': {
    //   backgroundColor: theme.palette.background.default,
    // },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  action: {
    display: 'inline-flex',
  },
});

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationActions = React.memo((props) => {
  const classes = useStyles1();
  const theme = useTheme();
  const {count, page, rowsPerPage, onChangePage} = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page">
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
});

const CustomizedTable = React.memo(
  ({
    headerTable,
    dataTable,
    actions,
    page,
    rowsPerPage,
    total,
    onPaginate,
    disablePagination,
  }) => {
    const {t} = useTranslation();

    const handleChangePage = (event, newPage) => {
      let page = newPage + 1;
      onPaginate({page, per_page: rowsPerPage});
    };

    const handleChangeRowsPerPage = (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      onPaginate({page, per_page: newRowsPerPage});
    };

    const classes = useStyles();

    return (
      <TableContainer>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                {t('number_order')}
              </StyledTableCell>
              {headerTable.map((cell, index) => (
                <StyledTableCell key={index} align="center">
                  {cell.label}
                </StyledTableCell>
              ))}
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTable.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="center">
                  {(page - 1) * rowsPerPage + index + 1}
                </StyledTableCell>
                {headerTable.map((cell, index) => (
                  <StyledTableCell key={index} align="center">
                    {row[cell.field]}
                  </StyledTableCell>
                ))}
                <StyledTableCell align="right">
                  {actions &&
                    actions.map((action, i) => (
                      <div
                        className={classes.action}
                        key={i}
                        onClick={() => action.onClick(row.id)}>
                        {action.component}
                      </div>
                    ))}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {!disablePagination && (
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50]}
                  colSpan={headerTable.length + 2}
                  count={total || dataTable.length}
                  rowsPerPage={rowsPerPage || 10}
                  page={page ? page - 1 : 0}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  },
);

export default CustomizedTable;
