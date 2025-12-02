package com.example.crud.dao;

import com.example.crud.model.Acompaniante;
<<<<<<< HEAD
import com.example.crud.model.TipoDocumento;
=======
import com.example.crud.enums.TipoDocumento;
>>>>>>> 9750e49a63e362977753ffc33b0571e870a723c8
import java.util.List;
import java.util.Optional;

public interface AcompanianteDao {
    Acompaniante save(Acompaniante a);

    Optional<Acompaniante> findById(Long id);

    List<Acompaniante> findAllById(List<Long> ids);

    Optional<Acompaniante> findByDocumento(TipoDocumento tipoDoc, String numeroDoc);
<<<<<<< HEAD
}
=======
}
>>>>>>> 9750e49a63e362977753ffc33b0571e870a723c8
