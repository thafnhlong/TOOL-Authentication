import React from 'react';
import { useLocation, useParams } from 'react-router';
import { getParams } from '../utils/helpers';




const Account = () => {
  const location = useLocation();
  const locParams = getParams(location);
  const {username} = useParams();

  const render = () => {
    return <>
      <div>
        Đây là trang tài khoản của {username}
      </div>
    </>
  }

  return render();
}


export default Account;