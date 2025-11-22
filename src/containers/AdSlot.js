import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AdSlot extends Component {
  static propTypes = {
    slot: PropTypes.string.isRequired,
    adWidth: PropTypes.string,
    adHeight: PropTypes.string
  };

  componentDidMount = () => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  };

  render = () => (
    <ins className="adsbygoogle"
        style={{display: 'inline-block', width: this.props.adWidth || 'auto', height: this.props.adHeight || 'auto'}}
        data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT}
        data-ad-slot={this.props.slot}>
    </ins>
  );
}

export default AdSlot;