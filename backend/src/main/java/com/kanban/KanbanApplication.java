package com.kanban;

import com.kanban.service.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "http://localhost:4200")
public class KanbanApplication implements CommandLineRunner {

	@Autowired
	private ColumnService columnService;

	public static void main(String[] args) {
		SpringApplication.run(KanbanApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Inicializar colunas padrão se não existirem
		columnService.initializeDefaultColumns();
	}
}
