import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi} from 'vitest';
import {CustomerView} from './CustomerView';
import {api} from '../../services/api';
import {useApp} from '../AppProvider';
vi.mock('../../services/api',()=>({api:vi.fn(),json:JSON.stringify}));
const state={user:{name:'Ana Silva',email:'ana@example.test',phone:'912345678'},authLoading:false,setReturnTo:vi.fn(),navigate:vi.fn(),logout:vi.fn(),setUser:vi.fn()};
vi.mock('../AppProvider',()=>({useApp:vi.fn()}));
beforeEach(()=>{vi.mocked(useApp).mockReturnValue(state as unknown as ReturnType<typeof useApp>);vi.clearAllMocks();});
it('carrega reservas da conta na API e mostra estado vazio',async()=>{
 vi.mocked(api).mockResolvedValue({data:[],meta:{current_page:1,last_page:1}});
 render(<CustomerView/>);
 expect(await screen.findByText('Ainda não tem reservas.')).toBeInTheDocument();
 expect(api).toHaveBeenCalledWith('/bookings?page=1');
});
it('guarda alterações do perfil no servidor',async()=>{
 vi.mocked(api).mockResolvedValue({data:{...state.user,name:'Ana Atualizada'}});
 render(<CustomerView view="profile"/>);
 const user=userEvent.setup();
 await user.clear(screen.getByLabelText('Nome completo'));await user.type(screen.getByLabelText('Nome completo'),'Ana Atualizada');
 await user.click(screen.getByRole('button',{name:'Guardar alterações'}));
 await waitFor(()=>expect(state.setUser).toHaveBeenCalledWith(expect.objectContaining({name:'Ana Atualizada'})));
 expect(api).toHaveBeenCalledWith('/user',expect.objectContaining({method:'PATCH'}));
});
