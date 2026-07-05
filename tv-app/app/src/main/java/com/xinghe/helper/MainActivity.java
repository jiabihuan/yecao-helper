package com.xinghe.helper;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.xinghe.helper.fragments.EmptyFragment;
import com.xinghe.helper.fragments.InstallFragment;
import com.xinghe.helper.fragments.ManagerFragment;
import com.xinghe.helper.fragments.RemoteFragment;

public class MainActivity extends AppCompatActivity {

    private LinearLayout navContainer;
    private Button btnSettings;
    private Fragment currentFragment;

    private String[] navItems = {"口令安装", "远程推送", "应用管理", "U盘安装", "星河推荐", "装机必备"};
    private int activeNav = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        navContainer = findViewById(R.id.navContainer);
        btnSettings = findViewById(R.id.btnSettings);

        initNavigation();
        switchFragment(0);

        btnSettings.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
            startActivity(intent);
        });
    }

    private void initNavigation() {
        navContainer.removeAllViews();
        for (int i = 0; i < navItems.length; i++) {
            Button btn = new Button(this);
            btn.setText(navItems[i]);
            btn.setTextSize(26);
            btn.setPadding(25, 12, 25, 12);
            btn.setBackgroundResource(i == activeNav ? R.drawable.nav_item_active : R.drawable.nav_item_bg);
            btn.setTextColor(getResources().getColor(i == activeNav ? R.color.text_primary : R.color.text_secondary));
            btn.setId(i);
            btn.setOnClickListener(v -> {
                activeNav = v.getId();
                updateNavStyle();
                switchFragment(activeNav);
            });

            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );
            params.setMargins(10, 0, 10, 0);
            navContainer.addView(btn, params);
        }
    }

    private void updateNavStyle() {
        for (int i = 0; i < navContainer.getChildCount(); i++) {
            Button btn = (Button) navContainer.getChildAt(i);
            btn.setBackgroundResource(i == activeNav ? R.drawable.nav_item_active : R.drawable.nav_item_bg);
            btn.setTextColor(getResources().getColor(i == activeNav ? R.color.text_primary : R.color.text_secondary));
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
                fragment = new EmptyFragment();
                break;
        }

        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();

        if (currentFragment != null) {
            ft.remove(currentFragment);
        }

        ft.add(R.id.contentFrame, fragment);
        ft.commit();
        currentFragment = fragment;
    }
}
