package com.xinghe.helper;

import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.app.Activity;

import com.xinghe.helper.fragments.InstallFragment;
import com.xinghe.helper.fragments.RemoteFragment;
import com.xinghe.helper.fragments.ManagerFragment;

public class MainActivity extends Activity implements View.OnClickListener {

    private Button btnInstall, btnRemote, btnManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btnInstall = findViewById(R.id.btnInstall);
        btnRemote = findViewById(R.id.btnRemote);
        btnManager = findViewById(R.id.btnManager);

        btnInstall.setOnClickListener(this);
        btnRemote.setOnClickListener(this);
        btnManager.setOnClickListener(this);

        switchFragment(0);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btnInstall) {
            switchFragment(0);
        } else if (v.getId() == R.id.btnRemote) {
            switchFragment(1);
        } else if (v.getId() == R.id.btnManager) {
            switchFragment(2);
        }
    }

    private void switchFragment(int index) {
        Fragment fragment = null;

        switch (index) {
            case 0:
                fragment = new InstallFragment();
                break;
            case 1:
                fragment = new RemoteFragment();
                break;
            case 2:
                fragment = new ManagerFragment();
                break;
            default:
                fragment = new InstallFragment();
                break;
        }

        btnInstall.setTextColor(index == 0 ? 0xFFFFFFFF : 0xFF94A3B8);
        btnRemote.setTextColor(index == 1 ? 0xFFFFFFFF : 0xFF94A3B8);
        btnManager.setTextColor(index == 2 ? 0xFFFFFFFF : 0xFF94A3B8);

        FragmentManager fm = getFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        ft.replace(R.id.contentFrame, fragment);
        ft.commit();
    }
}
