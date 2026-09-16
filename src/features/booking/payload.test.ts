import {lisbonDateTime} from './payload';
describe('horários de Portugal',()=>{
 it('aplica hora de verão independentemente do fuso do navegador',()=>expect(lisbonDateTime('2026-07-01','10:00')).toBe('2026-07-01T09:00:00+00:00'));
 it('aplica hora de inverno',()=>expect(lisbonDateTime('2026-12-01','10:00')).toBe('2026-12-01T10:00:00+00:00'));
 it('rejeita uma hora inexistente na mudança de março',()=>expect(()=>lisbonDateTime('2026-03-29','01:30')).toThrow());
});
