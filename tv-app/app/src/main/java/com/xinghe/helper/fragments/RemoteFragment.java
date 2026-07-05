package com.xinghe.helper.fragments;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.xinghe.helper.R;

public class RemoteFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_remote, container, false);

        TextView tvPhoneCode = view.findViewById(R.id.tvPhoneCode);
        TextView tvComputerCode = view.findViewById(R.id.tvComputerCode);

        tvPhoneCode.setText("http://xinghe-helper.com/" + generateCode());
        tvComputerCode.setText("http://xinghe-helper.com/" + generateCode());

        return view;
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (int i = 0; i < 8; i++) {
            code.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return code.toString();
    }
}
