import { Button, Grid } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => {
  return (
    <Container maxWidth="xl">
    <footer style={styles.footer}>
        <Grid alignItems={'center'} container spacing={2}>
        <Grid  item xs={4}>
        <Button sx={{color:'black'}} component={Link} to="/">
              Terminos y condiciones
        </Button>
        </Grid>
        <Grid item xs={4}>
        <div style={styles.centerContent}>
          <span>&copy; {new Date().getFullYear()} Gestor verde LTDA</span>
        </div>
        </Grid>
        <Grid spacing={6} item xs={4}>
        <WhatsAppIcon/>
        <TwitterIcon/>
        <FacebookIcon/>
        <InstagramIcon/>
        <GitHubIcon/>
        </Grid>
      </Grid>

    </footer>
    </Container>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    display: 'flex',
    alignContent: 'space-between',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#f8f8f8',
    padding: '20px 0',
    textAlign: 'center',
  },
};

export default Footer;
