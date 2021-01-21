import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import ListIcon from '@material-ui/icons/List';
import { ApplicationContext } from '../context/ApplicationContext';
import '../stylesheets/Header.scss';

export interface HeaderProps {
  app: string[];
  service: string;
  live: boolean;
  setLive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = React.memo(function Header({ app, service, setLive, live }) {
  const history = useHistory();

  const { servicesData } = useContext(ApplicationContext);

  return (
    <div className="microservice-header">
      <h1 className="microserviceTitle">{app}</h1>
      <select name="microservice" value={service} onChange={e => history.replace(e.target.value)}>
        {servicesData.map(({ _id, microservice }: any) => (
          // <option key={_id} value={`${microservice}`} selected={service === microservice}>
          <option key={_id} value={`${microservice}`}>
            {microservice}
          </option>
        ))}
        <option defaultValue='Select service'>
          Communications
        </option>
        {/* <option value="communications" selected={service === 'communications'}>
          communications
        </option> */}
      </select>
      <div className="header">
        <Link className="link" id="return" to="/applications">
          <span>
            <ListIcon className="icon" id="returnIcon" />
          </span>
          <p id="returnToDash">Dashboard</p>
        </Link>
        {/* <button id="returnButton" onClick={() => history.goBack()}><ListIcon className="icon" id="returnIcon" /></button> */}
        <button onClick={() => setLive(!live)}>
          {live ? (
            <div>
              <span id="live">Live</span>
            </div>
          ) : (
            <div id="gatherLiveData">Gather Live Data</div>
          )}
        </button>
      </div>
    </div>
  );
});

export default Header;
