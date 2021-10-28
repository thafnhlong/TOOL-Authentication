import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Phone } from '../public/home/phone.svg';
import { ReactComponent as Quote } from '../public/home/quote.svg';

const Home = () => {


  const render = () => {
    return <>
      <Section>
        <TitleWrapper>
          Dự án lưu trữ mật khẩu phi lợi nhuận
        </TitleWrapper>

        <ContentWrapper>
          <PhoneIconWrapper>
            <Phone />
          </PhoneIconWrapper>

          <QuoteWrapper>
            <Quote></Quote>
          </QuoteWrapper>

        </ContentWrapper>

      </Section>
    </>
  }

  return render();
}


export default Home;

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

  width: 1300px;
  height: 120px;


  color: #227093;
  font-size: 64px;
  font-weight: bold;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-content: center;

  flex-direction: row;

  width: 100%;
  height: auto;

  margin-top: 64px;

  justify-content: space-between;
`;

const PhoneIconWrapper = styled.div`
  display: flex;

  align-self: flex-start;

  margin-left: 100px;
  margin-top: 58px;

`;

const QuoteWrapper = styled.div`
  display:flex;

  align-self: flex-end;

  margin-right: 214px;
`;
