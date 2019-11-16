import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AdSlot extends Component {
  static propTypes = {
    slot: PropTypes.string
  };

  componentDidMount = () => {
		(window.adsbygoogle = window.adsbygoogle || []).push({})
  };

  render = () => (
    <ins className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT}
        data-ad-slot={this.props.slot}
        data-adtest="on"
        data-ad-format="auto"
        data-full-width-responsive={true}>
    </ins>
  );
}

export default AdSlot;