import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TableroController from '../controllers/TableroController';

// Hook para obtener todos los tableros
export const useTableros = () => {
  return useQuery({
    queryKey: ['tableros'],
    queryFn: TableroController.getAllTableros,
  });
};

// Hook para obtener un tablero por ID
export const useTablero = (id) => {
  return useQuery({
    queryKey: ['tableros', id],
    queryFn: () => TableroController.getTableroById(id),
    enabled: !!id,
  });
};

// Hook para crear un tablero
export const useCreateTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => TableroController.createTablero(data),
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
};

// Hook para actualizar un tablero
export const useUpdateTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => TableroController.updateTablero(id, data),
    onSuccess: (data, variables) => {
      // Invalidar la lista y el tablero específico
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
      queryClient.invalidateQueries({ queryKey: ['tableros', variables.id] });
    },
  });
};

// Hook para eliminar un tablero
export const useDeleteTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => TableroController.deleteTablero(id),
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
};
