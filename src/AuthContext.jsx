import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [teacherId, setTeacherId] = useState('');
  const [idCurso, setIdCurso] = useState('');
  const [subject, setSubject] = useState('');


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      login(storedToken);
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    const partes = newToken.split('.');
    if (partes.length !== 3) {
      throw new Error('El token no tiene el formato esperado');
    }

    console.log(newToken)
    const payloadBase64 = partes[1];
    // const payload = JSON.parse(decodeURIComponent(atob(payloadBase64)));

    const decodedPayload = atob(payloadBase64);

    const utf8DecodedPayload = new TextDecoder().decode(new Uint8Array(decodedPayload.split('').map(char => char.charCodeAt(0))));

    const payload = JSON.parse(utf8DecodedPayload);



    // Aquí asumimos que hay un campo 'rol' en el payload, ajusta según tu estructura de token
    setRole(payload.authorities[0].authority);
    setUsername(payload.sub)
    setNombreCompleto(payload.nombreCompleto)
    setTeacherId(payload.idTeacher)
    setSubject(payload.curso)
    setIdCurso(payload.idCurso)


  };

  const logout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ username, role, token, nombreCompleto, teacherId, subject, idCurso, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};