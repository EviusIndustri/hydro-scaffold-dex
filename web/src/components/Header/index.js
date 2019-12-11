import React from 'react';
import { loginRequest, login } from '../../actions/account';
import { updateCurrentMarket } from '../../actions/markets';
import { connect } from 'react-redux';
import { WalletButton, getSelectedAccount } from '@gongddex/hydro-sdk-wallet';
import './styles.scss';
import { loadAccountHydroAuthentication } from '../../lib/session';

const mapStateToProps = state => {
  const selectedAccount = getSelectedAccount(state);
  const address = selectedAccount ? selectedAccount.get('address') : null;
  return {
    address,
    isLocked: selectedAccount ? selectedAccount.get('isLocked') : true,
    isLoggedIn: state.account.getIn(['isLoggedIn', address]),
    currentMarket: state.market.getIn(['markets', 'currentMarket']),
    markets: state.market.getIn(['markets', 'data'])
  };
};

class Header extends React.PureComponent {
  componentDidMount() {
    const { address, dispatch } = this.props;
    const hydroAuthentication = loadAccountHydroAuthentication(address);
    if (hydroAuthentication) {
      dispatch(login(address));
    }
  }
  componentDidUpdate(prevProps) {
    const { address, dispatch } = this.props;
    const hydroAuthentication = loadAccountHydroAuthentication(address);
    if (address !== prevProps.address && hydroAuthentication) {
      dispatch(login(address));
    }
  }
  render() {
    const { currentMarket, markets, dispatch } = this.props;
    return (
      <div className="navbar navbar-expand-lg" style={{
        backgroundColor: "#1B105F"
      }}>
        <img className="navbar-brand" style={{
          height: '50px'
        }} src={require('../../images/vestrade-white.svg')} alt="hydro" />
        <div className="dropdown navbar-nav mr-auto">
          <button
            className="btn text-white px-4 py-2 rounded border-0 shadow-xl"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{
              backgroundImage: "linear-gradient(180deg, #3C39A1 0%, #2A217F 100%)"
            }}
          >
            <div className="flex items-center">
              <span className="font-bold tracking-wide">{currentMarket && currentMarket.id}</span>
              <span className="pl-2">
                <svg width="10" height="10" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.0001 15L0.339844 0H17.6604L9.0001 15Z" fill="white"/>
                </svg>
              </span>
            </div>
          </button>
          <div
            className="dropdown-menu"
            aria-labelledby="dropdownMenuButton"
            style={{ maxHeight: 350, overflow: 'auto' }}>
            {markets.map(market => {
              return (
                <button
                  className="dropdown-item"
                  key={market.id}
                  onClick={() => currentMarket.id !== market.id && dispatch(updateCurrentMarket(market))}>
                  {market.id}
                </button>
              );
            })}
          </div>
        </div>
        <button
          className="btn btn-primary collapse-toggle"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-collapse"
          aria-expanded="false">
          <i className="fa fa-bars" />
        </button>
        <div className="collapse" id="navbar-collapse">
          <div className="item">
            <WalletButton />
          </div>

          {this.renderAccount()}
        </div>
      </div>
    );
  }

  renderAccount() {
    const { address, dispatch, isLoggedIn, isLocked } = this.props;
    if ((isLoggedIn && address) || isLocked) {
      return null;
    } else if (address) {
      return (
        <button  className="font-bold text-white text-lg uppercase" style={{ marginLeft: 12 }} onClick={() => dispatch(loginRequest())}>
          connect
        </button>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps)(Header);
