package com.xinghe.helper;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {

    private EditText etServer;
    private Button btnSave;
    private Button btnBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        etServer = findViewById(R.id.etServer);
        btnSave = findViewById(R.id.btnSave);
        btnBack = findViewById(R.id.btnBack);

        loadServerUrl();

        btnBack.setOnClickListener(v -> finish());

        btnSave.setOnClickListener(v -> {
            saveServerUrl();
            finish();
        });
    }

    private void loadServerUrl() {
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        String url = prefs.getString("server_url", "");
        etServer.setText(url);
    }

    private void saveServerUrl() {
        String url = etServer.getText().toString().trim();
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("server_url", url);
        editor.apply();
    }
}
