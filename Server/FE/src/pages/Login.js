import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { getParams, parseJwt } from '../utils/helpers';
import { fetchApi } from '../apis/AxiosPromise';
import { url } from '../utils/urls';
import OTPInput from '../components/OTPInput';




const Login = () => {


  //params
  const location = useLocation();
  const locParams = getParams(location);
  const history = useHistory();

  //states
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState();

  //functions

  const handleOtpChange = (otp) => {
    setOtp(otp);
  }

  //effects
  useEffect(() => {
    if (otp.length == 6){
      post();
    }
  },[otp])

  const post = () => {

    const params = {
      username: locParams.username,
      otp: otp
    }

    fetchApi("POST", `${url}/users/login`, params)
      .then(res => {
        if (res && res.access_token) {
          let decodedToken = parseJwt(res.access_token);

          localStorage.setItem('token_expiration', decodedToken.exp);
          localStorage.setItem('access_token', res.access_token);

          setErr("Đăng nhập thành công");
          setTimeout(() => history.push(`/${params.username}`), 1500);
        }
      })
      .catch(err => {
        let errText;
        if (!err) {
          errText = "Lỗi mạng";
        }
        else {
          errText = err.error;
        }
        setErr(errText);
        setOtp('');
      });


  }

  const render = () => {
    return <>
      <Section>
        <TitleWrapper tabIndex="-1">
          Thông tin đăng nhập
        </TitleWrapper>

        <Title2Wrapper tabIndex="-1">
          Mật khẩu 6 số
        </Title2Wrapper>
        <OTPInput
          numInputs={6}
          value={otp}
          onChange={handleOtpChange}
          isInputNum={true}
        />

        {err && <Err tabIndex="-1">{err}</Err>}

      </Section>
    </>
  }

  return render();
}


export default Login;

const Section = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  width: 100%;
  height: auto;
`;

const TitleWrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 850px;
  height: 80px;

  margin-top: 80px;


  color: #718093;
  font-size: 80px;
  font-weight: bold;
`;

const Title2Wrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 650px;
  height: 80px;

  margin-top: 100px;


  color: #718093;
  font-size: 80px;
  font-weight: bold;
`;

const Err = styled.p`
  display: flex;

  margin-top: 40px;

  color: red;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
`;
