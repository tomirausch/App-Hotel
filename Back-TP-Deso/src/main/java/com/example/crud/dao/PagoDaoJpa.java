/*
 * package com.example.crud.dao;
 * 
 * import com.example.crud.modelFacturacion.Pago;
 * import com.example.crud.modelFacturacion.Factura;
 * import com.example.crud.repository.PagoRepository;
 * import lombok.RequiredArgsConstructor;
 * import org.springframework.beans.factory.annotation.Autowired;
 * import org.springframework.stereotype.Repository;
 * import java.time.LocalDate;
 * import java.util.List;
 * import java.util.Optional;
 * 
 * @Repository
 * 
 * @RequiredArgsConstructor(onConstructor = @__(@Autowired))
 * public class PagoDaoJpa implements PagoDao {
 * 
 * private final PagoRepository repository;
 * 
 * @Override
 * public Pago save(Pago pago) {
 * return repository.save(pago);
 * }
 * 
 * @Override
 * public void delete(Long id) {
 * repository.deleteById(id);
 * }
 * 
 * @Override
 * public Pago modificar(Pago pago) {
 * return repository.save(pago);
 * }
 * 
 * @Override
 * public Optional<Pago> findByFactura(Factura factura) {
 * return repository.findByFactura(factura);
 * }
 * 
 * @Override
 * public List<Pago> listarEntreFechas(LocalDate desde, LocalDate hasta) {
 * return repository.findByFechaBetween(desde, hasta);
 * }
 * }
 */