import axiosClient from './axiosClient';

export const createShipment = (payload) => {
  return axiosClient.post('/shipments', payload);
};

export const getShipmentDashboard = () => {
  return axiosClient.get('/shipments/dashboard');
};

export const getShipmentList = ({ page = 1, pageSize = 5, search = '', tripType = '' } = {}) => {
  return axiosClient.get('/shipments/list', {
    params: {
      page,
      limit: pageSize,
      ...(search ? { search } : {}),
      ...(tripType ? { tripType } : {}),
    },
  });
};

export const getShipmentDropdownOptions = () => {
  return axiosClient.get('/shipments/dropdown');
};

export const getShipmentDetails = (shipmentId) => {
  return axiosClient.get(`/shipments/${shipmentId}`);
};

export const updateShipment = (shipmentId, payload) => {
  return axiosClient.put(`/shipments/trackingUpdate/${shipmentId}`, payload);
};

export const editShipment = (shipmentId, payload) => {
  return axiosClient.put(`/shipments/update/${shipmentId}`, payload);
};

export const deleteShipmentApi = (shipmentId) => {
  return axiosClient.put(`/shipments/delete/${shipmentId}`);
};
