package com.xinghe.helper.fragments;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.xinghe.helper.R;

public class InstallFragment extends Fragment implements View.OnClickListener {

    private TextView[] codeDigits = new TextView[6];
    private StringBuilder currentCode = new StringBuilder();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_install, container, false);

        codeDigits[0] = view.findViewById(R.id.tvCode1);
        codeDigits[1] = view.findViewById(R.id.tvCode2);
        codeDigits[2] = view.findViewById(R.id.tvCode3);
        codeDigits[3] = view.findViewById(R.id.tvCode4);
        codeDigits[4] = view.findViewById(R.id.tvCode5);
        codeDigits[5] = view.findViewById(R.id.tvCode6);

        view.findViewById(R.id.btn0).setOnClickListener(this);
        view.findViewById(R.id.btn1).setOnClickListener(this);
        view.findViewById(R.id.btn2).setOnClickListener(this);
        view.findViewById(R.id.btn3).setOnClickListener(this);
        view.findViewById(R.id.btn4).setOnClickListener(this);
        view.findViewById(R.id.btn5).setOnClickListener(this);
        view.findViewById(R.id.btn6).setOnClickListener(this);
        view.findViewById(R.id.btn7).setOnClickListener(this);
        view.findViewById(R.id.btn8).setOnClickListener(this);
        view.findViewById(R.id.btn9).setOnClickListener(this);
        view.findViewById(R.id.btnDelete).setOnClickListener(this);
        view.findViewById(R.id.btnConfirm).setOnClickListener(this);

        return view;
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();

        if (id >= R.id.btn0 && id <= R.id.btn9) {
            if (currentCode.length() < 6) {
                currentCode.append(((Button) v).getText().toString());
                updateCodeDisplay();
            }
        } else if (id == R.id.btnDelete) {
            if (currentCode.length() > 0) {
                currentCode.deleteCharAt(currentCode.length() - 1);
                updateCodeDisplay();
            }
        } else if (id == R.id.btnConfirm) {
            if (currentCode.length() == 6) {
                Toast.makeText(getActivity(), "正在验证口令: " + currentCode.toString(), Toast.LENGTH_SHORT).show();
                currentCode.setLength(0);
                updateCodeDisplay();
            } else {
                Toast.makeText(getActivity(), "请输入完整的6位口令", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void updateCodeDisplay() {
        for (int i = 0; i < 6; i++) {
            if (i < currentCode.length()) {
                codeDigits[i].setText(currentCode.charAt(i) + "");
                codeDigits[i].setBackgroundColor(0xFF6366F1);
            } else {
                codeDigits[i].setText("");
                codeDigits[i].setBackgroundColor(0xFF334155);
            }
        }
    }
}
