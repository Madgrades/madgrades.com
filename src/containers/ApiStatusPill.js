import React, {Component} from 'react';
import {Label, Icon} from 'semantic-ui-react';
import fetchStatus from '../utils/fetchStatus';

const apiLink = 'https://status.madgrades.com/'

class ApiStatusPill extends Component {
  state = {
    uptime: undefined,
    status: 'N/A'
  }

  componentWillMount = () => {
    fetchStatus()
      .then(monitor => {
        if (monitor !== undefined && monitor.uptime !== undefined) {
          this.setState({
            uptime: monitor.uptime,
            status: monitor.status
          });
        }
      });
  }

  render = () => {
    const { uptime, status } = this.state;

    const uptimePercent = uptime === undefined ? 'N/A' : (uptime >= 100 ? 100 : uptime.toFixed(2))

    var icon = 'thumbs down';
    var text = `${uptimePercent}% Uptime`
    var color;

    if (status === 'N/A') {
      text = 'Unknown Status'
      color = undefined;
    }
    else if (status === 'DOWN') {
      text = 'API Down';
      color = 'red';
    }
    else if (status === 'SEEMS_DOWN') {
      text = 'API Unstable';
      color = 'orange';
    }
    else if (uptime < 75) {
      color = 'red';
    }
    else if (uptime < 95) {
      color = 'orange';
    }
    else if (uptime < 99) {
      color = 'yellow';
      icon = 'thumbs up';
    }
    else {
      color = 'green';
      icon = 'thumbs up';
    }
    
    return (
      <Label horizontal color={color} as='a' href={apiLink}>
        <Icon name={icon}/> {text}
      </Label>
    )
  }
}

export default ApiStatusPill;
