const axios = require("axios");

const API_BASE_URL = process.env.API_BASE_URL;

function createHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function makeRequest(endpoint, data, token, credencial, password) {
  try {
    // Intentamos hacer la solicitud con el token actual
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, {
      headers: token ? createHeaders(token) : undefined,
    });
    return response.data;
  } catch (error) {
    // Si el error es por un token expirado (401), volvemos a autenticar
    if (error.response?.status === 401) {
      console.log('Token expired, re-authenticating...');
      
      // Hacemos una nueva autenticación llamando al controlador loginAuth
      const authResponse = await loginAuth({ body: { credencial, password } }); // Simulamos la llamada al controller de login
      const { access_token, refresh_token } = authResponse.data;

      // Usamos el nuevo token para reintentar la solicitud original
      return makeRequest(endpoint, data, access_token, credencial, password);
    }

    // Si el error no es por expiración de token, lo lanzamos normalmente
    console.error(`Error in ${endpoint}: ${error.response?.data?.message || error.message}`);
    throw new Error(`Request to ${endpoint} failed`);
  }
}

async function authenticateStudent(username, password) {
  return makeRequest('login/authenticate', { Username: username, Password: password });
}

async function getStudentData(token, username) {
  const data = await makeRequest('buscar', { sp: "Bus_DatosAlumno", parametros: [username] }, token);
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No student data found');
  }
  return data[0];
}

async function getTeacherMateriasData(token, matricula, anio, periodo) {
  const data = await makeRequest(
    'buscar',
    { sp: "Lst_GrupoMateriaMaestroxMatriculaLinea", parametros: [matricula, anio, periodo] },
    token
  );
  return data.map(([grupo, carrera, idMaestro, nombreMaestro, idMateria, materia]) => ({
    grupo,
    carrera,
    idMaestro,
    nombreMaestro,
    idMateria,
    materia,
  }));
}

async function getTeacherData(token, idMaestro) {
  const data = await makeRequest('buscar', { sp: "Bus_MaestrosLinea", parametros: [idMaestro] }, token);
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No teacher data found');
  }
  return data[0];
}

async function getStudentsByYearAndPeriod(token, anio, periodo) {
  return makeRequest(
    'buscar',
    { sp: "Lst_AlumnosxgruposAniosLinea", parametros: [anio, periodo] },
    token
  );
}

module.exports = {
  authenticateStudent,
  getStudentData,
  getTeacherMateriasData,
  getTeacherData,
  getStudentsByYearAndPeriod,
};