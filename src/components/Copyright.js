import React from 'react';
import Typography from '@material-ui/core/Typography';
//-------------------------------------

const Copyright = React.memo(props => (
  <Typography
    variant="body2"
    color="textSecondary"
    align="center"
    style={props.styles}>
    Copyright © {new Date().getFullYear()} 電子決裁システム. All Rights
    Reserved.
  </Typography>
));

export default Copyright;
