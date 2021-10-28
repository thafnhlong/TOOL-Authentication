import React from 'react';
import { useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import { getParams } from '../utils/helpers';




const Account = () => {
  const location = useLocation();
  const locParams = getParams(location);
  const {username} = useParams();

  const render = () => {
    return <>
      <Section>
        Đây là trang tài khoản của {username}
      </Section>
    </>
  }

  return render();
}


export default Account;

const Section = styled.div`
  width: '100%';
  height: '100%';
`;