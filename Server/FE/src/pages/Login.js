import React from 'react';
import { useLocation } from 'react-router';
import { getParams } from '../utils/helpers';




const Login = () => {
  const location = useLocation();
  const locParams = getParams(location);

  const render = () => {
    return <>
      <div>
        Đây là trang Đăng nhập {locParams?.username}
      </div>
    </>
  }

  return render();
}


export default Login;