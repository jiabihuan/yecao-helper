package com.xinghe.helper.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

import com.xinghe.helper.R;

public class InstallFragment extends Fragment {

    private TextView[] codeViews = new TextView[4];
    private String[] code = {"", "", "", ""};
    private int currentIndex = 0;
    private LinearLayout errorLayout;
    private TextView tvError;
    private LinearLayout loadingLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_install, container, false);

        codeViews[0] = view.findViewById(R.id.tvCode1);
        codeViews[1] = view.findViewById(R.id.tvCode2);
        codeViews[2] = view.findViewById(R.id.tvCode3);
        codeViews[3] = view.findViewById(R.id.tvCode4);

        errorLayout = view.findViewById(R.id.errorLayout);
        tvError = view.findViewById(R.id.tvError);
        loadingLayout = view.findViewById(R.id.loadingLayout);

        setupKeyboard(view);
        updateFocus();

        return view;
    }

    private void setupKeyboard(View view) {
        int[] keyIds = {R.id.key0, R.id.key1, R.id.key2, R.id.key3, R.id.key4, R.id.key5,
                R.id.key6, R.id.key7, R.id.key8, R.id.key9, R.id.keyA, R.id.keyB,
                R.id.keyC, R.id.keyD, R.id.keyE, R.id.keyF, R.id.keyG, R.id.keyH};

        for (int id : keyIds) {
            Button btn = view.findViewById(id);
            btn.setOnClickListener(v -> {
                Button b = (Button) v;
                String key = b.getText().toString();
                onKeyPressed(key);
            });
        }

        Button btnDel = view.findViewById(R.id.keyDel);
        btnDel.setOnClickListener(v -> onKeyPressed("del"));

        Button btnOk = view.findViewById(R.id.keyOk);
        btnOk.setOnClickListener(v -> onKeyPressed("ok"));
    }

    private void onKeyPressed(String key) {
        if (key.equals("del")) {
            if (currentIndex > 0) {
                currentIndex--;
                code[currentIndex] = "";
                codeViews[currentIndex].setText("");
                codeViews[currentIndex].setBackgroundResource(R.drawable.code_digit_normal);
            }
            errorLayout.setVisibility(View.GONE);
            return;
        }

        if (key.equals("ok")) {
            if (isCodeComplete()) {
                verifyCode();
            } else {
                showError("请输入完整的4位口令");
            }
            return;
        }

        if (currentIndex < 4) {
            code[currentIndex] = key;
            codeViews[currentIndex].setText(key);
            codeViews[currentIndex].setBackgroundResource(R.drawable.code_digit_focus);
            currentIndex++;
            updateFocus();

            if (currentIndex == 4) {
                verifyCode();
            }
        }
    }

    private void updateFocus() {
        for (int i = 0; i < 4; i++) {
            if (i == currentIndex && i < 4) {
                codeViews[i].setBackgroundResource(R.drawable.code_digit_focus);
            } else if (!code[i].isEmpty()) {
                codeViews[i].setBackgroundResource(R.drawable.code_digit_focus);
            } else {
                codeViews[i].setBackgroundResource(R.drawable.code_digit_normal);
            }
        }
    }

    private boolean isCodeComplete() {
        for (String c : code) {
            if (c.isEmpty()) return false;
        }
        return true;
    }

    private void verifyCode() {
        errorLayout.setVisibility(View.GONE);
        loadingLayout.setVisibility(View.VISIBLE);
    }

    private void showError(String msg) {
        tvError.setText(msg);
        errorLayout.setVisibility(View.VISIBLE);
        loadingLayout.setVisibility(View.GONE);
    }
}
