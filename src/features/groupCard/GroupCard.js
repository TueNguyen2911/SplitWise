import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { useHistory } from 'react-router-dom';

const StyledCard = styled(Card)(({theme}) => ({
    margin: '10px 10px',
    width: '330px',
    boxShadow: '1px 1px 2px',
    [theme.breakpoints.down("md")]: {
        width: '280px'
    },
    transition: 'width 0.2s',
    '&:hover': {
      opacity: '0.5'
    },
}));

const CardContainer = styled('div')({
  margin: '20px 20px',
  display: 'flex', 
  flexDirection: 'row', 
  flexWrap: 'wrap'
})

export default function GroupCard() {
    const [groups, setGroups] = React.useState([
      {
        name: 'Qiqi lovers', 
        avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Qiyana_1.jpg',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      }, 
      {
        name: 'Qiqi lovers', 
        avatar: 'https://pbs.twimg.com/media/EJEIZ4lX0AAEEuQ?format=jpg&name=large',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      },
      {
        name: 'Qiqi lovers', 
        avatar: 'https://pbs.twimg.com/media/EJEIZ4lX0AAEEuQ?format=jpg&name=large',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      },
      {
        name: 'Qiqi lovers', 
        avatar: 'https://pbs.twimg.com/media/EJEIZ4lX0AAEEuQ?format=jpg&name=large',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      },
      {
        name: 'Qiqi lovers', 
        avatar: 'https://pbs.twimg.com/media/EJEIZ4lX0AAEEuQ?format=jpg&name=large',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      },
      {
        name: 'Qiqi lovers', 
        avatar: 'https://pbs.twimg.com/media/EJEIZ4lX0AAEEuQ?format=jpg&name=large',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      },
      {
        name: 'Qiqi lovers', 
        avatar: 'https://pbs.twimg.com/media/EJEIZ4lX0AAEEuQ?format=jpg&name=large',
        members: [
          {
            name: 'Tue', 
            avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c0467381257987.5cf9cc3b7ec5c.png'
          },
          {
            name: 'Tue2', 
            avatar: 'https://i.imgur.com/ag8Ggoy.png'
          },
        ]
      }
    ]);
    const history = useHistory();
    return (
      <CardContainer onClick={() => history.push('/expenses')}>
        {groups.map(elem => (
          <StyledCard>
          <Box sx={{ display: 'flex', flex: '1 1 0px' }}>
            <CardMedia
              component="img"
              sx={{ width: '165px', height: '165px', objectFit: 'cover' }}
              image={elem.avatar}
              alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '5px' }}>
              {elem.members.map(elem => (
                <Avatar alt={elem.name} src={elem.avatar} />
              ))}
            </Box>
          </Box>
          <Divider/>
          <CardContent sx={{textAlign: 'left'}}>Ngu</CardContent>
        </StyledCard>
        ))}
      </CardContainer>
      
    );
  }