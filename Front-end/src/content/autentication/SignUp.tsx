import Head from "next/head";
import * as React from 'react';
import { useState } from "react";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Button,
  Grid,
  TextField,
  Typography,
  Avatar,
  CssBaseline,
  Box,
  Container,
} from '@mui/material';
import { useRouter } from "next/router";
import getConfig  from "next/config";

const { publicRuntimeConfig } = getConfig();

function SignUp() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
  });

  const handleRegister: React.MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();
    const formRegister = new FormData();
    formRegister.append('full_name', formData.full_name);
    formRegister.append('username', formData.username);
    formRegister.append('password', formData.password);
    formRegister.append('upload_image', file!);  // แนบรูปภาพ
    try {
      const response = await fetch(`${publicRuntimeConfig.BackEnd}auth/register`, {
        method: 'POST',
        body: formRegister,
      });
      console.log('formData:', formRegister);
      console.log('full_name:', formRegister.get('full_name'));
      console.log('username:', formRegister.get('username'));
      console.log('password:', formRegister.get('password'));
      if (response.ok) {
        const responseData = await response.json();
        const uploadedImageUrl = responseData.imageUrl;
        setImageUrl(uploadedImageUrl);
        console.log('Response Data:', responseData);
        console.log('Registed successfully!');
        router.push('/auth/login');
      } else {
        console.error('Register failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      // ทำการอ่านไฟล์รูปภาพ
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
  
      setFile(selectedFile);  // เซ็ตค่า file ใน state
    }
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box className="mt-8 p-8 bg-white rounded-md shadow-md">
            <div className="flex flex-col items-center">
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Register
              </Typography>
              <form className="mt-1 w-full" noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Full_name"
                  label="Full Name"
                  name="Full_name"
                  autoComplete="Full_name"
                  autoFocus
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Email / Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Uploaded Image" className="w-300 h-300 justify-center" />
                )}
                <Button variant="outlined" component="label" htmlFor="dropzone-file" className="mt-2">
                  Upload Image
                </Button>
    
                <Button
                  fullWidth
                  variant="outlined"
                  className="mt-3 mb-2"
                  component="a"
                  type="submit"
                  onClick={handleRegister}
                  >
                  Register
                </Button>
                <Grid
                  container
                  justifyContent="center"
                  className="mt-5"
                  sx={{ borderTop: '2px solid #ccc', paddingTop: '15px' }}
                >
                  <Grid item>
                    <Typography 
                      variant="body2"
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => router.push('/auth/login')}
                      >
                      {"Already have an account? Login"}
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Box>
        </Container>
      </div>
    </>
  );
}
export default SignUp;