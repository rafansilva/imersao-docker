package com.algaworks.algatransito.api.assembler;

import com.algaworks.algatransito.api.model.ProprietarioModel;
import com.algaworks.algatransito.api.model.input.ProprietarioInput;
import com.algaworks.algatransito.domain.model.Proprietario;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class ProprietarioAssembler {

    private final ModelMapper modelMapper;

    public Proprietario toEntity(ProprietarioInput proprietarioInput) {
        return modelMapper.map(proprietarioInput, Proprietario.class);
    }

    public ProprietarioModel toModel(Proprietario proprietario) {
        return modelMapper.map(proprietario, ProprietarioModel.class);
    }

    public List<ProprietarioModel> toCollectionModel(List<Proprietario> proprietarios) {
        return proprietarios.stream()
                .map(this::toModel)
                .toList();
    }
}
